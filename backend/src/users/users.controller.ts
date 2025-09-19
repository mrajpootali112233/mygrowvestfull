import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRole } from '../common/enums';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, GetUser } from '../common/decorators/auth.decorators';
import { UpdateUserDto, UserResponseDto } from './dto/user.dto';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() currentUser: User,
  ): Promise<UserResponseDto> {
    // Users can only view their own profile, admins can view any profile
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('You can only access your own profile');
    }

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isSuspended: user.isSuspended,
      referralCode: user.referralCode,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isSuspended: user.isSuspended,
      referralCode: user.referralCode,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}