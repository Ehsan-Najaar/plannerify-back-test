// src/about/dto/create-about.dto.ts
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateTermsDto {
  @IsInt()
  @Min(1)
  languageId: number;

  @IsString()
  @IsNotEmpty()
  contentHtml: string;
}
