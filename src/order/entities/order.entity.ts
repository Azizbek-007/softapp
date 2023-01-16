import { Course } from "src/course/entities/course.entity";
import { Lead } from "src/leads/entities/lead.entity";
import { LeadsStatus } from "src/leads/role.enum";
import { SaveOptions, RemoveOptions, ManyToOne, Entity, Column } from "typeorm";

@Entity()
export class Order extends Lead {

    @ManyToOne((type) => Course, (course) => course.order, 
    {
        eager: true,
        cascade: true
    })
    course: Course;

    @Column({ nullable: true })
    courseId: number
}
