import { IsString, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  dueDate: string;

  @IsInt()
  priority: number;

  @IsString()
  category: string;
}

export class PlanSettingsDto {
  @IsBoolean()
  notification: boolean;

  @IsBoolean()
  priorityColors: boolean;
}
