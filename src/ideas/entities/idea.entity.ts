import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Idea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  userId: number;
}
