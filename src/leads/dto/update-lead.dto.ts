import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPassportNumber, IsString, NotEquals } from 'class-validator';
import { Course } from 'src/course/entities/course.entity';
import { LeadsStatus } from '../role.enum';
import { CreateLeadDto } from './create-lead.dto';

export class UpdateLeadDto {
    @IsString()
    user_id: string;

    @IsString()
    @IsOptional()
    FIO?: string;

    @IsString()
    @IsOptional()
    comment?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsEnum(LeadsStatus)
    @IsOptional()
    status?: LeadsStatus 


    @IsNumber()
    @IsOptional()
    courseId?: number;


}
