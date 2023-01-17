import { LeadsStatus } from "src/leads/role.enum";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('settings')
export class Setting extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bot_token: string;

    @Column()
    bot_username: string;

    @Column()
    bot_chat_id: string;

    @Column({ select: false })
    path: string;

    @Column('enum', {enum: LeadsStatus })
    status: LeadsStatus;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;
}
