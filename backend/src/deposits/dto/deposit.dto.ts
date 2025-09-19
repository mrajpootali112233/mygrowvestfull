import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { DepositStatus } from '../../common/enums';

export class CreateDepositDto {
  @IsNumber({}, { message: 'Amount must be a valid number' })
  @Min(1, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsString()
  method: string;

  @IsOptional()
  @IsString()
  txId?: string;
}

export class DepositResponseDto {
  id: number;
  userId: number;
  amount: number;
  method: string;
  txId?: string;
  proofUrl?: string;
  status: DepositStatus;
  createdAt: Date;
}