import { Injectable } from '@nestjs/common';
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

  async getMe(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email'],
    });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserById(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createUser(data: RegisterDto) {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }
}
