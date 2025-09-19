import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Withdrawal } from '../entities/withdrawal.entity';
import { User } from '../entities/user.entity';
import { WithdrawalStatus, UserRole } from '../common/enums';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, GetUser } from '../common/decorators/auth.decorators';
import { CreateWithdrawalDto, WithdrawalResponseDto } from './dto/withdrawal.dto';

@Controller('withdrawals')
@UseGuards(AuthGuard('jwt'))
export class WithdrawalsController {
  constructor(
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepository: Repository<Withdrawal>,
  ) {}

  @Post()
  async createWithdrawal(
    @Body() createWithdrawalDto: CreateWithdrawalDto,
    @GetUser() user: User,
  ): Promise<WithdrawalResponseDto> {
    const withdrawal = this.withdrawalRepository.create({
      ...createWithdrawalDto,
      userId: user.id,
      status: WithdrawalStatus.PENDING,
    });

    await this.withdrawalRepository.save(withdrawal);

    return {
      id: withdrawal.id,
      userId: withdrawal.userId,
      amount: withdrawal.amount,
      methodDetails: withdrawal.methodDetails,
      status: withdrawal.status,
      createdAt: withdrawal.createdAt,
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getWithdrawals(
    @Query('status') status?: WithdrawalStatus,
    @Query('userId') userId?: number,
  ): Promise<WithdrawalResponseDto[]> {
    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const withdrawals = await this.withdrawalRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    return withdrawals.map(withdrawal => ({
      id: withdrawal.id,
      userId: withdrawal.userId,
      amount: withdrawal.amount,
      methodDetails: withdrawal.methodDetails,
      status: withdrawal.status,
      createdAt: withdrawal.createdAt,
    }));
  }
}