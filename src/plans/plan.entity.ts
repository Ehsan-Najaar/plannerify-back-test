import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column()
  priority: number;

  @Column({ type: 'date', nullable: true })
  dueDate: string;

  @Column()
  done: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  lastNotifiedAt: Date | null;

  @Column()
  userId: number;
}

@Entity()
export class PlanSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  notification: boolean;

  @Column()
  priorityColors: boolean;

  @Column()
  userId: number;
}
