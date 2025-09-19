import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { UserRole } from '../common/enums';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  AuthResponseDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, referralCode } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Validate referral code if provided
    let referrer: User | null = null;
    if (referralCode) {
      referrer = await this.userRepository.findOne({
        where: { referralCode },
      });
      if (!referrer) {
        throw new BadRequestException('Invalid referral code');
      }
    }

    // Create new user
    const hashedPassword = await this.authService.hashPassword(password);
    const newReferralCode = this.authService.generateReferralCode();

    const user = this.userRepository.create({
      email,
      passwordHash: hashedPassword,
      role: UserRole.USER,
      referralCode: newReferralCode,
      referredBy: referrer?.id || null,
    });

    await this.userRepository.save(user);

    // Generate tokens
    const tokens = await this.authService.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isSuspended) {
      throw new UnauthorizedException('Account is suspended');
    }

    // Verify password
    const isPasswordValid = await this.authService.comparePasswords(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.authService.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists for security
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // TODO: Implement email sending logic
    // For now, just return success message
    return { message: 'If the email exists, a reset link has been sent' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    // TODO: Implement token validation and password reset logic
    // For now, just return success message
    return { message: 'Password has been reset successfully' };
  }
}