// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Exclude } from 'class-transformer';
import { Survey } from 'src/surveys/entities/survey.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Survey, (survey) => survey.user)
  surveys: Survey[]; // A user can have many surveys

  @OneToMany(() => Survey, (report) => report.user)
  reports: Survey[]; // A user can have many surveys

  @Column({ default: 'user' })
  role: string;

  @Column({ default: 'none' })
  plan: string;

  @Column({ type: 'timestamp', nullable: true })
  planExp: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
