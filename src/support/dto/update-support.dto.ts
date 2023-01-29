import { IsString } from 'class-validator';

export class UpdateSupportDto {
  @IsString()
  answer: string;
}
