import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  time: string;

  @IsString()
  date: string;

  // 🆕 فیلدهای جدید برای تحلیل روزانه، هفتگی، ماهانه
  @IsString()
  weekday: string; // مثل "Monday"

  @IsString()
  month: string; // مثل "Nov" یا "11"

  @IsInt()
  year: number;

  @IsInt()
  sort: number;

  @IsBoolean()
  all: boolean;

  @IsBoolean()
  notification: boolean;

  @IsInt()
  priority: number;
}

export class TaskResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  time: string;

  @Exclude()
  lastNotifiedTime: string;

  @Expose()
  date: string;

  // 🆕 نمایش فیلدهای جدید در پاسخ
  @Expose()
  weekday: string;

  @Expose()
  month: string;

  @Expose()
  year: number;

  @Expose()
  sort: number;

  @Expose()
  all: boolean;

  @Expose()
  notification: boolean;

  @Expose()
  priority: number;
}
