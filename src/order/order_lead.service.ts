import { Body, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Instrument } from "src/instrument/entities/instrument.entity";
import { CreateLeadDto } from "src/leads/dto/create-lead.dto";
import { Lead } from "src/leads/entities/lead.entity";
import { LeadsService } from "src/leads/leads.service";
import { LeadsStatus } from "src/leads/role.enum";
import { Repository } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "./entities/order.entity";
import { OrderService } from "./order.service";

@Injectable()
export class OrderLeadPublic extends LeadsService{
    constructor(
        @InjectRepository(Lead) private readonly leadRepo: Repository<Lead>,
        @InjectRepository(Instrument) private readonly InstRepo: Repository<Instrument>,
        @InjectRepository(Order) private OrderRepository: Repository<Order>
    ) {
        super(leadRepo, InstRepo);
    }
    async public_create (dto: CreateLeadDto) {
        dto.course = dto.courseId;
        dto.status = LeadsStatus.inactive;
        let data = await this.create(dto);
        console.log(data);   
        dto.lead_course_id = `${data.id}${dto.courseId}`
        let new_order = this.OrderRepository.create({
        FIO: data.FIO,
        phone: data.phone,
        lead: data,
        course: dto.course,
        lead_course_id:  dto.lead_course_id
        });

        try {
        await new_order.save();
        return new_order;
        } catch (error) {
        if (error['code'] == 'ER_NO_REFERENCED_ROW_2') {
            throw new NotFoundException("Not found course or lead id " + dto.course);
        }
        if (error['code'] == 'ER_DUP_ENTRY'){
            throw new ConflictException();
        }
        } 
    }
}
