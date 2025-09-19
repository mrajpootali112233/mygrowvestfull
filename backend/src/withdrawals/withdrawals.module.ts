import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawalsController } from './withdrawals.controller';
import { Withdrawal } from '../entities/withdrawal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Withdrawal])],
  controllers: [WithdrawalsController],
  providers: [],
  exports: [],
})
export class WithdrawalsModule {}