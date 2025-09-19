import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deposit } from '../entities/deposit.entity';
import { Withdrawal } from '../entities/withdrawal.entity';
import { ProfitLedger } from '../entities/profit-ledger.entity';
import { Investment } from '../entities/investment.entity';
import { Plan } from '../entities/plan.entity';
import { UserRole, DepositStatus, WithdrawalStatus } from '../common/enums';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, GetUser } from '../common/decorators/auth.decorators';
import { User } from '../entities/user.entity';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepository: Repository<Withdrawal>,
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(ProfitLedger)
    private readonly profitLedgerRepository: Repository<ProfitLedger>,
  ) {}

  @Patch('deposits/:id/approve')
  async approveDeposit(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() admin: User,
  ): Promise<{ message: string }> {
    const deposit = await this.depositRepository.findOne({
      where: { id },
    });

    if (!deposit) {
      throw new Error('Deposit not found');
    }

    deposit.status = DepositStatus.APPROVED;
    deposit.reviewedBy = admin.id;
    await this.depositRepository.save(deposit);

    return { message: 'Deposit approved successfully' };
  }

  @Patch('deposits/:id/reject')
  async rejectDeposit(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() admin: User,
  ): Promise<{ message: string }> {
    const deposit = await this.depositRepository.findOne({
      where: { id },
    });

    if (!deposit) {
      throw new Error('Deposit not found');
    }

    deposit.status = DepositStatus.REJECTED;
    deposit.reviewedBy = admin.id;
    await this.depositRepository.save(deposit);

    return { message: 'Deposit rejected successfully' };
  }

  @Patch('withdrawals/:id/approve')
  async approveWithdrawal(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() admin: User,
  ): Promise<{ message: string }> {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id },
    });

    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }

    withdrawal.status = WithdrawalStatus.APPROVED;
    withdrawal.reviewedBy = admin.id;
    await this.withdrawalRepository.save(withdrawal);

    return { message: 'Withdrawal approved successfully' };
  }

  @Patch('withdrawals/:id/reject')
  async rejectWithdrawal(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() admin: User,
  ): Promise<{ message: string }> {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id },
    });

    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }

    withdrawal.status = WithdrawalStatus.REJECTED;
    withdrawal.reviewedBy = admin.id;
    await this.withdrawalRepository.save(withdrawal);

    return { message: 'Withdrawal rejected successfully' };
  }

  @Post('run-daily-profit')
  async runDailyProfit(
    @GetUser() admin: User,
  ): Promise<{ message: string; totalDistributed: number }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if profit has already been distributed today
    const existingLedger = await this.profitLedgerRepository.findOne({
      where: { date: today },
    });

    if (existingLedger) {
      return {
        message: 'Daily profit has already been distributed today',
        totalDistributed: Number(existingLedger.totalDistributed),
      };
    }

    // Get all active investments
    const activeInvestments = await this.investmentRepository.find({
      where: { status: 'active' },
      relations: ['plan'],
    });

    let totalDistributed = 0;

    for (const investment of activeInvestments) {
      const dailyProfit = (Number(investment.amount) * Number(investment.plan.dailyPercent)) / 100;
      investment.profitAccrued = Number(investment.profitAccrued) + dailyProfit;
      totalDistributed += dailyProfit;

      await this.investmentRepository.save(investment);
    }

    // Create ledger entry
    const ledger = this.profitLedgerRepository.create({
      date: today,
      totalDistributed,
      createdBy: admin.id,
    });

    await this.profitLedgerRepository.save(ledger);

    return {
      message: 'Daily profit distributed successfully',
      totalDistributed,
    };
  }
}