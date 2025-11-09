import { IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  logoBase64?: string;

  @IsOptional()
  @IsString()
  siteName?: string;
}
