import { Course } from 'src/course/entities/course.entity';
import { Lead } from 'src/leads/entities/lead.entity';

export class UpdateOrderDto {
    course: Course;
    lead: Lead;   
}
