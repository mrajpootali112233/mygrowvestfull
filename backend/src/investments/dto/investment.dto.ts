import { IsNumber, Min } from 'class-validator';
import { InvestmentStatus } from '../../common/enums';

export class CreateInvestmentDto {
  @IsNumber({}, { message: 'Plan ID must be a valid number' })
  planId: number;

  @IsNumber({}, { message: 'Amount must be a valid number' })
  @Min(1, { message: 'Amount must be greater than 0' })
  amount: number;
}

export class InvestmentResponseDto {
  id: number;
  userId: number;
  planId: number;
  amount: number;
  profitAccrued: number;
  startDate: Date;
  endDate: Date;
  status: InvestmentStatus;
  createdAt: Date;
}