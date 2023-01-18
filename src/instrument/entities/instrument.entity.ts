import { Lead } from "src/leads/entities/lead.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('instruments')
export class Instrument extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    link: string;

    @Column()
    code: string;

    @Column()
    price: number;

    @Column({ default: 0 })
    clicked: number;

    @Column({ default: 0 })
    distribution: number;
    
    @OneToMany(() => Lead, (lead) => lead.instrument)
    leads: Lead[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date
}
