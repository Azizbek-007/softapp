import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsPassportNumber, IsString, NotEquals } from 'class-validator';
import { CreateLeadDto } from './create-lead.dto';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
    @IsOptional()
    @IsString()
    comment?: string;

    @IsOptional()
    @IsString()
    phone?: string;
}
