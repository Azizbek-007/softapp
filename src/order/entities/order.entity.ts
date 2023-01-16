import { Course } from "src/course/entities/course.entity";
import { Lead } from "src/leads/entities/lead.entity";
import { ManyToOne, Entity } from "typeorm";

@Entity('orders')
export class Order extends Lead {

    @ManyToOne((type) => Course, (course) => course.order, { eager: true })
    course: Course;
}
