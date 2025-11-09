// src/about/dto/create-about.dto.ts
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateAboutDto {
  @IsInt()
  @Min(1)
  languageId: number;

  @IsString()
  @IsNotEmpty()
  contentHtml: string;
}
