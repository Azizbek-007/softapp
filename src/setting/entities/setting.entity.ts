import { LeadsStatus } from "src/leads/role.enum";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('settings')
export class Setting extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    bot_token: string;

    @Column({ nullable: true })
    bot_username: string;

    @Column({ nullable: true })
    bot_chat_id: string;

    @Column({ nullable: true })
    contact: string;

    @Column({ select: false, nullable:true })
    path: string;

    @Column('enum', {enum: LeadsStatus })
    status: LeadsStatus;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;
}
