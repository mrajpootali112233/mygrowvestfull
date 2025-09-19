import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hashedPassword = 'hashedPassword';
      
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      const result = await service.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('comparePasswords', () => {
    it('should return true when passwords match', async () => {
      const plainPassword = 'testPassword123';
      const hashedPassword = 'hashedPassword';
      
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.comparePasswords(plainPassword, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false when passwords do not match', async () => {
      const plainPassword = 'testPassword123';
      const hashedPassword = 'differentHashedPassword';
      
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.comparePasswords(plainPassword, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
      expect(result).toBe(false);
    });
  });

  describe('generateTokens', () => {
    it('should generate access token and refresh token', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
      } as any;

      const accessToken = 'access.token.here';
      const refreshToken = 'refresh.token.here';

      mockJwtService.sign
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);
      
      mockConfigService.get
        .mockReturnValueOnce('refresh-secret')
        .mockReturnValueOnce('7d');

      const result = await service.generateTokens(user);

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(1, {
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(2, {
        sub: user.id,
        email: user.email,
        role: user.role,
      }, {
        secret: 'refresh-secret',
        expiresIn: '7d',
      });
      
      expect(result).toEqual({
        accessToken,
        refreshToken,
      });
    });

    it('should generate only access token when no refresh secret', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
      } as any;

      const accessToken = 'access.token.here';

      mockJwtService.sign.mockReturnValueOnce(accessToken);
      mockConfigService.get.mockReturnValueOnce(undefined); // no refresh secret

      const result = await service.generateTokens(user);

      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        accessToken,
        refreshToken: undefined,
      });
    });
  });

  describe('validateToken', () => {
    it('should return payload when token is valid', async () => {
      const token = 'valid.token.here';
      const payload = { sub: 1, email: 'test@example.com', role: 'user' };
      
      mockJwtService.verify.mockReturnValue(payload);

      const result = await service.validateToken(token);

      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
      expect(result).toBe(payload);
    });

    it('should return null when token is invalid', async () => {
      const token = 'invalid.token.here';
      
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = await service.validateToken(token);

      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
      expect(result).toBeNull();
    });
  });

  describe('validateRefreshToken', () => {
    it('should return payload when refresh token is valid', async () => {
      const token = 'valid.refresh.token.here';
      const payload = { sub: 1, email: 'test@example.com', role: 'user' };
      const refreshSecret = 'refresh-secret';
      
      mockConfigService.get.mockReturnValue(refreshSecret);
      mockJwtService.verify.mockReturnValue(payload);

      const result = await service.validateRefreshToken(token);

      expect(mockJwtService.verify).toHaveBeenCalledWith(token, { secret: refreshSecret });
      expect(result).toBe(payload);
    });

    it('should return null when no refresh secret is configured', async () => {
      const token = 'refresh.token.here';
      
      mockConfigService.get.mockReturnValue(undefined);

      const result = await service.validateRefreshToken(token);

      expect(mockJwtService.verify).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when refresh token is invalid', async () => {
      const token = 'invalid.refresh.token.here';
      const refreshSecret = 'refresh-secret';
      
      mockConfigService.get.mockReturnValue(refreshSecret);
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = await service.validateRefreshToken(token);

      expect(mockJwtService.verify).toHaveBeenCalledWith(token, { secret: refreshSecret });
      expect(result).toBeNull();
    });
  });

  describe('generateReferralCode', () => {
    it('should generate a referral code of length 8', () => {
      const referralCode = service.generateReferralCode();
      
      expect(referralCode).toHaveLength(8);
      expect(referralCode).toMatch(/^[A-Z0-9]+$/);
    });

    it('should generate different codes on multiple calls', () => {
      const code1 = service.generateReferralCode();
      const code2 = service.generateReferralCode();
      
      expect(code1).not.toBe(code2);
    });
  });
});