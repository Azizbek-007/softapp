import { IsString, IsPhoneNumber, IsEnum } from 'class-validator';
import { Course } from 'src/course/entities/course.entity';
import { LeadsStatus } from '../role.enum';

export class CreateLeadDto {

    @IsString()
    user_id: string;

    @IsString()
    FIO: string;

    @IsPhoneNumber('UZ')
    phone: string;

    @IsString()
    utm: string;

    @IsEnum(LeadsStatus)
    status: LeadsStatus;

    course: Course;
    comment: string;
}
