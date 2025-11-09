// src/schedule/dto/create-schedule.dto.ts

import { IsOptional, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  start: string;

  @IsString()
  end: string;

  @IsOptional()
  @IsString()
  backgroundColor?: string;
}
