import { Course } from "src/course/entities/course.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LeadsStatus } from "../role.enum";

@Entity()
export class Lead extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: string;

    @Column()
    FIO: string;

    @Column({ nullable: true })
    phone: string;

    @Column()
    utm: string;

    @Column('enum', { enum: LeadsStatus})
    status: LeadsStatus;

    @Column({ nullable: true })
    comment: string;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
    deletedAt: Date;
}
