import { LeadsStatus } from "src/leads/role.enum";
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Course } from "src/course/entities/course.entity";
import { Lead } from "src/leads/entities/lead.entity";

export class CreateOrderDto{
    @IsOptional()
    lead: Lead;

    @IsString()
    user_id: string;

    @IsNumber()
    course: Course;

    @IsOptional()
    lead_course_id: string;
}
