import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  time: string;

  @Column({ nullable: true })
  lastNotifiedTime: string;

  @Column({ type: 'timestamp', nullable: true })
  date: Date;

  @Column({ nullable: true })
  day: string;

  @Column({ nullable: true })
  week: number;

  @Column()
  sort: number;

  @Column({ default: false })
  done: boolean;

  @Column()
  notification: boolean;

  @Column({ nullable: true })
  all: boolean;

  @Column()
  userId: number;

  @Column()
  priority: number;
}
