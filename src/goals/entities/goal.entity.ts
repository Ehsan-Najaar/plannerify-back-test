import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  progress: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  date: string;

  @Column({ type: 'json', nullable: true })
  tasks: {
    title: string;
    description: string;
    completed: boolean;
  }[];
}
