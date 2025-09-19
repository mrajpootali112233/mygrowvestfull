import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InvestmentStatus } from '../common/enums';
import { User } from './user.entity';
import { Plan } from './plan.entity';
import { ProfitLedger } from './profit-ledger.entity';

@Entity('investments')
export class Investment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'plan_id' })
  planId: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ name: 'profit_accrued', type: 'decimal', precision: 15, scale: 2, default: 0 })
  profitAccrued: number;

  @Column({ name: 'start_date', type: 'timestamp' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: InvestmentStatus,
    default: InvestmentStatus.ACTIVE,
  })
  status: InvestmentStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.investments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Plan, (plan) => plan.investments)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @OneToMany(() => ProfitLedger, (profitEntry) => profitEntry.investment)
  profitEntries: ProfitLedger[];
}