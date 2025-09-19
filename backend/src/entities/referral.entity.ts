import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'referrer_id' })
  referrerId: number;

  @Column({ name: 'referred_id' })
  referredId: number;

  @Column({ name: 'commission_amount', type: 'decimal', precision: 15, scale: 2 })
  commissionAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.referralsGiven)
  @JoinColumn({ name: 'referrer_id' })
  referrer: User;

  @ManyToOne(() => User, (user) => user.referralsReceived)
  @JoinColumn({ name: 'referred_id' })
  referred: User;
}