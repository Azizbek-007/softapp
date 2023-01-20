import { Course } from "src/course/entities/course.entity";
import { Instrument } from "src/instrument/entities/instrument.entity";
import { Order } from "src/order/entities/order.entity";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, DatabaseType, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LeadsStatus } from "../role.enum";
import moment from 'moment';
import { Transform } from 'class-transformer';
import format from 'date-fns/format';
import parseJSON from 'date-fns/parseJSON';
@Entity('leads_cm')
export class Lead extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    user_id: string;

    @Column()
    FIO: string;

    @Column({ nullable: true })
    phone: string;


    @Column('enum', { enum: LeadsStatus})
    status: LeadsStatus;

    @Column({ nullable: true }) 
    comment: string;

    @ManyToOne(() => Instrument, (instrument) => instrument.leads, { eager: true })
    instrument: Instrument;

    @ManyToOne(() => Order, (order) => order.lead, { cascade: true })
    order: Order;

   

    @CreateDateColumn({ name: 'created_at', default: new Date((new Date()).getTime() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .replace(/(.*)T(.*)\..*/,'$1 $2')})
    createdAt: Date;



}
