// src/socials/entities/social.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('socials')
@Unique(['name'])
@Unique(['link'])
export class Social {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 512 })
  link: string;

  // Base64 strings can be long => use text
  @Column({ type: 'text', name: 'logo_base64' })
  logoBase64: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
