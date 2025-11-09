// src/goals/dto/create-goal.dto.ts

import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsString,
  ValidateNested,
} from 'class-validator';

class TaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  completed: boolean = false;
}

export class CreateGoalDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  progress?: number;

  @IsString()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks: TaskDto[];
}
