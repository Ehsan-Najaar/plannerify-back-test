import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Payments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  amount: string;

  @Column()
  orderId: string;

  @CreateDateColumn({ type: 'timestamp' })
  applyDate: Date;
}
