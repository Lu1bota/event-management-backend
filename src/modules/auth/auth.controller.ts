import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoginDtoResponse } from './dto/login-response.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Public } from 'src/decorators/public.decorator';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User register' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated. Returns tokens.',
    type: LoginDtoResponse,
  })
  async register(@Body() registerDto: RegisterDto): Promise<LoginDtoResponse> {
    return await this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated. Returns tokens.',
    type: LoginDtoResponse,
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginDtoResponse> {
    const session = await this.authService.login(loginDto);

    this.authService.setupSession(res, session);

    return { accessToken: session.accessToken };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh user session using refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Session successfully refreshed. Returns new access token.',
    type: LoginDtoResponse,
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginDtoResponse> {
    const { sessionId, refreshToken } = req.cookies as {
      sessionId: string;
      refreshToken: string;
    };

    if (!refreshToken || !sessionId) {
      throw new UnauthorizedException('Refresh token or User ID missing');
    }

    const session = await this.authService.refreshUserSession({
      userId: sessionId,
      refreshToken,
    });

    this.authService.setupSession(res, session);

    return { accessToken: session.accessToken };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out.',
    schema: {
      example: { message: 'Logged out successfully' },
    },
  })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const { sessionId } = req.cookies as {
      sessionId: string;
      refreshToken: string;
    };

    if (!sessionId) {
      throw new UnauthorizedException('User not authenticated');
    }

    await this.authService.logout(sessionId);

    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    res.clearCookie('sessionId', { path: '/' });

    return { message: 'Logged out successfully' };
  }
}
