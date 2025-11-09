import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bronzeTitle: string;

  @Column()
  bronzeDescription: string;

  @Column()
  bronzePrice: string;

  @Column()
  bronzeOptions: string;

  @Column()
  silverTitle: string;

  @Column()
  silverDescription: string;

  @Column()
  silverPrice: string;

  @Column()
  silverOptions: string;

  @Column()
  goldTitle: string;

  @Column()
  goldDescription: string;

  @Column()
  goldPrice: string;

  @Column()
  goldOptions: string;
}
