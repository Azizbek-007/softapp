import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsOptional, IsPassportNumber, IsString, NotEquals } from 'class-validator';
import { LeadsStatus } from '../role.enum';
import { CreateLeadDto } from './create-lead.dto';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
    @IsOptional()
    @IsString()
    comment?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEnum(LeadsStatus)
    status?: LeadsStatus 
}
