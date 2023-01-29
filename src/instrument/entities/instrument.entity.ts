import { Lead } from 'src/leads/entities/lead.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InstrumentTypeEnum } from '../intrument.enum';

@Entity('instruments')
export class Instrument extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  link: string;

  @Column({ nullable: true })
  code: string;

  @Column()
  price: number;

  @Column({ default: 0 })
  clicked: number;

  @Column('enum', { enum: InstrumentTypeEnum })
  type: InstrumentTypeEnum;

  @Column({ default: 0 })
  distribution: number;

  @OneToMany(() => Lead, (lead) => lead.instrument)
  leads: Lead[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
