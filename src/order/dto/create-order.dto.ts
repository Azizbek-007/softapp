import { LeadsStatus } from "src/leads/role.enum";
import { IsNumber } from 'class-validator';
import { Course } from "src/course/entities/course.entity";

export class CreateOrderDto{
    @IsNumber()
    id: number;
    
    course: Course;
    
    comment: string
}
