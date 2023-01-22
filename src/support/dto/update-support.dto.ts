import { PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateSupportDto } from './create-support.dto';

export class UpdateSupportDto {
    @IsString()
    answer: string;
}
