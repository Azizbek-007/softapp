import { Lead } from "src/leads/entities/lead.entity";
import { Order } from "src/order/entities/order.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Course extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: false })
    clicked: number;

    @OneToMany((type) => Order, (order) => order.course)
    order: Order[];

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;
}
