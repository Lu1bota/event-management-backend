import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginDtoResponse } from './dto/login-response.dto';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/users.entity';
import { PayloadDto } from './dto/jwt-payload.dto';
import { FIFTEEN_MINUTES_MS, ONE_DAY_MS, ONE_DAY_SEC } from 'src/constants';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { Session } from './session.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshSessionRequestDto } from './dto/refresh-session-request.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async register(data: RegisterDto): Promise<LoginDtoResponse> {
    const user = await this.usersService.getUserByEmail(data.email);

    if (user) throw new ConflictException('Email in use');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.usersService.createUser({
      ...data,
      password: hashedPassword,
    });

    const { accessToken } = await this.generateTokens(newUser);

    return { accessToken };
  }

  async login(data: LoginDto): Promise<Session> {
    const user = await this.usersService.getUserByEmail(data.email);

    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password or email');
    }

    await this.sessionRepository.delete({ userId: user.id });

    const tokens = await this.generateTokens(user);

    const newSession = this.sessionRepository.create({
      userId: user.id,
      ...tokens,
    });

    return await this.sessionRepository.save(newSession);
  }

  async logout(userId: string): Promise<void> {
    if (!userId) throw new UnauthorizedException('User not found');

    await this.sessionRepository.delete({ userId });
  }

  async refreshUserSession({
    userId,
    refreshToken,
  }: RefreshSessionRequestDto): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { userId, refreshToken },
    });

    if (!session) throw new UnauthorizedException('Session not found');

    if (session.refreshTokenValidUntil < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.usersService.getMe(session.userId);

    if (!user) throw new UnauthorizedException('User not found');

    const newSession = await this.generateTokens(user);

    await this.sessionRepository.delete({
      userId: session.userId,
      refreshToken,
    });

    const createSesion = this.sessionRepository.create({
      userId: session.userId,
      ...newSession,
    });

    return await this.sessionRepository.save(createSesion);
  }

  setupSession(res: Response, session: Session) {
    const IS_SECURE = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', session.accessToken, {
      httpOnly: true,
      secure: IS_SECURE,
      sameSite: IS_SECURE ? 'none' : 'lax',
      path: '/',
      expires: session.accessTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      secure: IS_SECURE,
      sameSite: IS_SECURE ? 'none' : 'lax',
      path: '/',
      expires: session.refreshTokenValidUntil,
    });

    res.cookie('sessionId', session.userId, {
      httpOnly: true,
      secure: IS_SECURE,
      sameSite: IS_SECURE ? 'none' : 'lax',
      path: '/',
      expires: session.refreshTokenValidUntil,
    });
  }

  async validateSession(userId: string, accessToken: string): Promise<boolean> {
    const session = await this.sessionRepository.findOne({
      where: { userId, accessToken },
    });

    return !!session;
  }

  public async generateTokens(user: User): Promise<TokensResponseDto> {
    const payload: PayloadDto = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESHTOKEN_SECRET,
      expiresIn: ONE_DAY_SEC,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES_MS),
      refreshTokenValidUntil: new Date(Date.now() + ONE_DAY_MS),
    };
  }
}
