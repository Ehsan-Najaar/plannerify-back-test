import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column()
  priority: number;

  @Column({ nullable: true })
  answer: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.surveys, { onDelete: 'CASCADE' })
  user: User;
}
