import { Course } from "src/course/entities/course.entity";
import { Instrument } from "src/instrument/entities/instrument.entity";
import { Order } from "src/order/entities/order.entity";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, DatabaseType, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LeadsStatus } from "../role.enum";

@Entity('leads_cm')
export class Lead extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    user_id: string;

    @Column()
    FIO: string;

    @Column({ default: '0'})
    phone: string;


    @Column('enum', { enum: LeadsStatus, default: 0})
    status: LeadsStatus;

    @Column({ nullable: true }) 
    comment: string;

    // @ManyToOne(() => Course)
    // course: Course;

    // @Column({ nullable: true })
    // courseId: number;

    @ManyToOne(() => Instrument, (instrument) => instrument.leads, { eager: true, nullable:true })
    instrument: Instrument;

    @ManyToOne(() => Order, (order) => order.lead, { cascade: true })
    order: Order;

   

    @CreateDateColumn({ name: 'created_at', default: new Date((new Date()).getTime() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .replace(/(.*)T(.*)\..*/,'$1 $2')})
    createdAt: Date;



}
