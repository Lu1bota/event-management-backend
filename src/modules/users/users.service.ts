import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getMe(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email'],
      relations: ['organizedEvents', 'participations'],
    });

    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }

  async createUser(data: RegisterDto) {
    const user = this.userRepository.create(data);

    return await this.userRepository.save(user);
  }
}
