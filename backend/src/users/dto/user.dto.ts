import { IsEmail, IsBoolean, IsOptional } from 'class-validator';
import { UserRole } from '../../common/enums';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @IsBoolean()
  isSuspended?: boolean;
}

export class UserResponseDto {
  id: number;
  email: string;
  role: UserRole;
  isSuspended: boolean;
  referralCode: string;
  createdAt: Date;
  updatedAt: Date;
}