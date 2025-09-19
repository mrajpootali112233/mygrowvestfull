import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('admin_logs')
export class AdminLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'admin_id' })
  adminId: number;

  @Column()
  action: string;

  @Column({ type: 'text', nullable: true })
  meta: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.adminLogs)
  @JoinColumn({ name: 'admin_id' })
  admin: User;
}