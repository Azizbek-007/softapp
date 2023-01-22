import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Support extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    question: string;

    @Column({ nullable: true })
    answer: string;

    @Column()
    user_id: string;

    @Column()
    message_id: string;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

}
