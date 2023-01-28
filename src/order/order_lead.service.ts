import { Body, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Instrument } from "src/instrument/entities/instrument.entity";
import { CreateLeadDto } from "src/leads/dto/create-lead.dto";
import { Lead } from "src/leads/entities/lead.entity";
import { LeadsService } from "src/leads/leads.service";
import { Repository } from "typeorm";
import { OrderService } from "./order.service";

@Injectable()
export class OrderLeadPublic extends LeadsService{
    constructor(
        @InjectRepository(Lead) private readonly leadRepo: Repository<Lead>,
        @InjectRepository(Instrument) private readonly InstRepo: Repository<Instrument>
    ) {
        super(leadRepo, InstRepo);
    }
    async cr (dto: CreateLeadDto) {
        let data = await this.create(dto);
        console.log(data);    
    }
}
