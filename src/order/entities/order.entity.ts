import { Course } from "src/course/entities/course.entity";
import { Lead } from "src/leads/entities/lead.entity";
import { ManyToOne, Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity('orders')
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => Lead, (lead) => lead.order, { eager: true })
    lead: Lead;

    @ManyToOne((type) => Course, (course) => course.order, { eager: true })
    course: Course;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
