import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SupportTicketStatus } from '../common/enums';
import { User } from './user.entity';

@Entity('support_tickets')
export class SupportTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: SupportTicketStatus,
    default: SupportTicketStatus.OPEN,
  })
  status: SupportTicketStatus;

  @Column({ name: 'admin_replies', type: 'text', nullable: true })
  adminReplies: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.supportTickets)
  @JoinColumn({ name: 'user_id' })
  user: User;
}