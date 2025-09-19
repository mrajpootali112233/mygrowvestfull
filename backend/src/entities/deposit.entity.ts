import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DepositStatus } from '../common/enums';
import { User } from './user.entity';

@Entity('deposits')
export class Deposit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column()
  method: string;

  @Column({ name: 'tx_id', nullable: true })
  txId: string;

  @Column({ name: 'proof_url', nullable: true })
  proofUrl: string;

  @Column({
    type: 'enum',
    enum: DepositStatus,
    default: DepositStatus.PENDING,
  })
  status: DepositStatus;

  @Column({ name: 'reviewed_by', nullable: true })
  reviewedBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.deposits)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: User;
}