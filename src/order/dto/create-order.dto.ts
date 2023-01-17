import { LeadsStatus } from "src/leads/role.enum";
import { IsNumber } from 'class-validator';
import { Course } from "src/course/entities/course.entity";
import { Lead } from "src/leads/entities/lead.entity";

export class CreateOrderDto{
    lead: Lead;
    course: Course;
}
