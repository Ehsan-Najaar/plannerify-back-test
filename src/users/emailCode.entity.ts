import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  code: number;

  @Column()
  validUntil: number;
}
