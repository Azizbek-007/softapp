import { Course } from 'src/course/entities/course.entity';
import { CreateLeadDto } from 'src/leads/dto/create-lead.dto';
import { LeadsStatus } from 'src/leads/role.enum';

export class UpdateOrderDto implements CreateLeadDto {
    course: Course;
    comment: string;
    FIO: string;
    phone: string;
    utm: string;
    status: LeadsStatus;
    user_id: string;
}
