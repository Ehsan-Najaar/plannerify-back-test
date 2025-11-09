import { Type } from 'class-transformer';
import {
  IsArray,
  isArray,
  IsString,
  isString,
  ValidateNested,
} from 'class-validator';

class KeyValuePair {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class CreateContentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeyValuePair)
  data: KeyValuePair[];
}
