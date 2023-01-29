import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateSupportDto {
  @IsString()
  answer: string;
}
