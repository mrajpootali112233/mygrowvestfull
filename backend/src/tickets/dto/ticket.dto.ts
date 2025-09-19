import { IsString, IsOptional } from 'class-validator';
import { SupportTicketStatus } from '../../common/enums';

export class CreateTicketDto {
  @IsString()
  subject: string;

  @IsString()
  message: string;
}

export class ReplyTicketDto {
  @IsString()
  reply: string;
}

export class TicketResponseDto {
  id: number;
  userId: number;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  adminReplies?: string;
  createdAt: Date;
}