import { IsNumber, IsString, Min } from 'class-validator';
import { WithdrawalStatus } from '../../common/enums';

export class CreateWithdrawalDto {
  @IsNumber({}, { message: 'Amount must be a valid number' })
  @Min(1, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsString()
  methodDetails: string;
}

export class WithdrawalResponseDto {
  id: number;
  userId: number;
  amount: number;
  methodDetails: string;
  status: WithdrawalStatus;
  createdAt: Date;
}