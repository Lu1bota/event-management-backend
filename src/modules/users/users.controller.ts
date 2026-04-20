import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './users.entity';
import type { Request } from 'express';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  // @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'User info' })
  @ApiResponse({
    status: 200,
    description: 'Successfully get user info.',
    type: User,
  })
  async getMe(@Req() req: Request): Promise<User | null> {
    if (!req.user) return null;

    return await this.userService.getMe(req.user.id);
  }
}
