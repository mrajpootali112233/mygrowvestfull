import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentsController } from './investments.controller';
import { Investment } from '../entities/investment.entity';
import { Plan } from '../entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Investment, Plan])],
  controllers: [InvestmentsController],
  providers: [],
  exports: [],
})
export class InvestmentsModule {}