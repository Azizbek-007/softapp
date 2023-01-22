import { IsEnum, IsOptional } from 'class-validator';
import { Course } from 'src/course/entities/course.entity';
import { Lead } from 'src/leads/entities/lead.entity';
import { LeadsStatus } from 'src/leads/role.enum';

export class UpdateOrderDto {
    @IsOptional()
    course: Course;

    @IsOptional()
    lead: Lead;
    
    @IsOptional()
    @IsEnum(LeadsStatus)
    order_status?: LeadsStatus;

    @IsOptional()
    order_comment: string;
}
  