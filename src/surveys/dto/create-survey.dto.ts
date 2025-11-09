import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateSurveyDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsInt()
  priority: number;

  @IsOptional()
  @IsString()
  answer: string;
}
