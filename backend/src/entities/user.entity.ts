import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserRole } from '../common/enums';
import { Investment } from './investment.entity';
import { Deposit } from './deposit.entity';
import { Withdrawal } from './withdrawal.entity';
import { SupportTicket } from './support-ticket.entity';
import { AdminLog } from './admin-log.entity';
import { Referral } from './referral.entity';
import { ProfitLedger } from './profit-ledger.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ name: 'is_suspended', default: false })
  isSuspended: boolean;

  @Column({ name: 'referral_code', unique: true, nullable: true })
  referralCode: string;

  @Column({ name: 'referred_by', nullable: true })
  referredBy: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'referred_by' })
  referrer: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Investment, (investment) => investment.user)
  investments: Investment[];

  @OneToMany(() => Deposit, (deposit) => deposit.user)
  deposits: Deposit[];

  @OneToMany(() => Withdrawal, (withdrawal) => withdrawal.user)
  withdrawals: Withdrawal[];

  @OneToMany(() => SupportTicket, (ticket) => ticket.user)
  supportTickets: SupportTicket[];

  @OneToMany(() => AdminLog, (log) => log.admin)
  adminLogs: AdminLog[];

  @OneToMany(() => Referral, (referral) => referral.referrer)
  referralsGiven: Referral[];

  @OneToMany(() => Referral, (referral) => referral.referred)
  referralsReceived: Referral[];
}