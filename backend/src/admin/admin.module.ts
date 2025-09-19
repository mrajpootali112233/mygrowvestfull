import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { Deposit } from '../entities/deposit.entity';
import { Withdrawal } from '../entities/withdrawal.entity';
import { Investment } from '../entities/investment.entity';
import { Plan } from '../entities/plan.entity';
import { ProfitLedger } from '../entities/profit-ledger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deposit, Withdrawal, Investment, Plan, ProfitLedger])],
  controllers: [AdminController],
  providers: [],
  exports: [],
})
export class AdminModule {}