import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './tickets.controller';
import { SupportTicket } from '../entities/support-ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupportTicket])],
  controllers: [TicketsController],
  providers: [],
  exports: [],
})
export class TicketsModule {}