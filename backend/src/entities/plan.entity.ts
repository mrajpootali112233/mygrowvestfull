import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Investment } from './investment.entity';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'daily_percent', type: 'decimal', precision: 5, scale: 2 })
  dailyPercent: number;

  @Column({ name: 'lock_period_days' })
  lockPeriodDays: number;

  @Column({ name: 'refundable_principal', default: true })
  refundablePrincipal: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Investment, (investment) => investment.plan)
  investments: Investment[];
}