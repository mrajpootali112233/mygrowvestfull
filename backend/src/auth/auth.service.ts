import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken?: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    // Optional refresh token
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    
    let refreshToken: string | undefined;
    if (refreshSecret) {
      refreshToken = this.jwtService.sign(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      });
    }

    return { accessToken, refreshToken };
  }

  async validateToken(token: string): Promise<JwtPayload | null> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }

  async validateRefreshToken(token: string): Promise<JwtPayload | null> {
    try {
      const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
      if (!refreshSecret) return null;
      
      return this.jwtService.verify(token, { secret: refreshSecret });
    } catch (error) {
      return null;
    }
  }

  generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}