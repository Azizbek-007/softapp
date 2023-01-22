import { Course } from "src/course/entities/course.entity";
import { Lead } from "src/leads/entities/lead.entity";
import { LeadsStatus } from "src/leads/role.enum";
import { ManyToOne, Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, Column } from "typeorm";

@Entity('orders')
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    FIO: string;

    @Column({ nullable: true })
    phone: string;

    @Column('enum', { enum: LeadsStatus, default: 0})
    order_status: LeadsStatus;

    @Column({ nullable: true })
    order_comment: string;

    @ManyToOne((type) => Lead, (lead) => lead.order, {eager: true})
    lead: Lead;

    @ManyToOne((type) => Course, (course) => course.order, { eager: true, cascade: true })
    course: Course;

    @Column({ unique: true })
    lead_course_id: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
