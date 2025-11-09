// schedule.entiity.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  start: string;

  @Column()
  end: string;

  @Column({ default: '#851fd2' })
  backgroundColor: string;
}
