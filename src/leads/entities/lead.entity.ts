import { Course } from "src/course/entities/course.entity";
import { Instrument } from "src/instrument/entities/instrument.entity";
import { Order } from "src/order/entities/order.entity";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, DatabaseType, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LeadsStatus } from "../role.enum";

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

    @OneToMany(() => Order, (order) => order.lead)
    order: Order[];


    @CreateDateColumn({ name: 'created_at',  type: 'datetime'})
    createdAt: Date;

}
