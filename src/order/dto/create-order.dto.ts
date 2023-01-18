import { LeadsStatus } from "src/leads/role.enum";
import { IsNumber, IsOptional } from 'class-validator';
import { Course } from "src/course/entities/course.entity";
import { Lead } from "src/leads/entities/lead.entity";

export class CreateOrderDto{
    @IsNumber()
    lead: Lead;

    @IsNumber()
    course: Course;

    @IsOptional()
    lead_course_id: string;
}
