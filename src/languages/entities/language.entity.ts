import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  languageCode: string;

  @Column()
  direction: string;

  @Column()
  file: string;
}
