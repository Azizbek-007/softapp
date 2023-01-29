import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateSettingDto } from './create-setting.dto';

export class UpdateSettingDto {
  @IsString()
  contact: string;
}
