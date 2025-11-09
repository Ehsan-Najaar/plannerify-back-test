// src/socials/dto/create-social.dto.ts
import { IsNotEmpty, IsString, MaxLength, IsUrl } from 'class-validator';

export class CreateSocialDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsUrl({ require_protocol: true })
  @MaxLength(512)
  link: string;

  @IsString()
  @IsNotEmpty()
  // You can tighten this regex if you want data URIs only:
  // e.g., /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/
  logoBase64: string;
}
