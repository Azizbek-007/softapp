import { IsString, IsPhoneNumber, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Course } from 'src/course/entities/course.entity';
import { LeadsStatus } from '../role.enum';

export class CreateLeadDto {

    @IsOptional()
    @IsString()
    user_id: string;

    @IsString()
    FIO: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    instrument: any;

    @IsOptional()
    comment: string;

    @IsNumber()
    @IsOptional()
    courseId?: number;

    
    // exdents for OrderPublic

    @IsOptional()
    @IsNumber()
    course: any;

    @IsOptional()
    lead_course_id: string;

    @IsEnum(LeadsStatus)
    @IsOptional()
    status?: LeadsStatus 
}
