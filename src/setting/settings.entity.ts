import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  logoBase64: string;

  @Column({ nullable: true })
  siteName: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
