import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket } from '../entities/support-ticket.entity';
import { User } from '../entities/user.entity';
import { SupportTicketStatus, UserRole } from '../common/enums';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, GetUser } from '../common/decorators/auth.decorators';
import { CreateTicketDto, ReplyTicketDto, TicketResponseDto } from './dto/ticket.dto';

@Controller('tickets')
@UseGuards(AuthGuard('jwt'))
export class TicketsController {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly ticketRepository: Repository<SupportTicket>,
  ) {}

  @Post()
  async createTicket(
    @Body() createTicketDto: CreateTicketDto,
    @GetUser() user: User,
  ): Promise<TicketResponseDto> {
    const ticket = this.ticketRepository.create({
      ...createTicketDto,
      userId: user.id,
      status: SupportTicketStatus.OPEN,
    });

    await this.ticketRepository.save(ticket);

    return {
      id: ticket.id,
      userId: ticket.userId,
      subject: ticket.subject,
      message: ticket.message,
      status: ticket.status,
      adminReplies: ticket.adminReplies,
      createdAt: ticket.createdAt,
    };
  }

  @Get(':id')
  async getTicket(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Users can only view their own tickets, admins can view any ticket
    if (user.role !== UserRole.ADMIN && ticket.userId !== user.id) {
      throw new NotFoundException('Ticket not found');
    }

    return {
      id: ticket.id,
      userId: ticket.userId,
      subject: ticket.subject,
      message: ticket.message,
      status: ticket.status,
      adminReplies: ticket.adminReplies,
      createdAt: ticket.createdAt,
    };
  }

  @Post(':id/reply')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async replyToTicket(
    @Param('id', ParseIntPipe) id: number,
    @Body() replyTicketDto: ReplyTicketDto,
    @GetUser() admin: User,
  ): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Add reply to existing replies
    const currentReplies = ticket.adminReplies ? JSON.parse(ticket.adminReplies) : [];
    currentReplies.push({
      adminId: admin.id,
      reply: replyTicketDto.reply,
      timestamp: new Date(),
    });

    ticket.adminReplies = JSON.stringify(currentReplies);
    ticket.status = SupportTicketStatus.IN_PROGRESS;

    await this.ticketRepository.save(ticket);

    return {
      id: ticket.id,
      userId: ticket.userId,
      subject: ticket.subject,
      message: ticket.message,
      status: ticket.status,
      adminReplies: ticket.adminReplies,
      createdAt: ticket.createdAt,
    };
  }
}