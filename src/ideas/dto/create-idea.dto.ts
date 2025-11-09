import { IsInt, IsString } from 'class-validator';

export class CreateIdeaDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
