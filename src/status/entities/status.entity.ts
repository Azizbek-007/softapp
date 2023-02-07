import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('status')
export class Status extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
