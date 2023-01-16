import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead } from './entities/lead.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private LeadRepository: Repository<Lead>
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    let form_lead = this.LeadRepository.create(createLeadDto);
    try {
      await form_lead.save()
      return form_lead;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }  
  }

  async findAll() {
    let find = await this.LeadRepository.findBy({ deletedAt: null });
    if (find.length == 0) {
      throw new NotFoundException();
    }
    return find;
  }

  findOne(id: number) {
    return `This action returns a #${id} lead`;
  }

  update(id: number, updateLeadDto: UpdateLeadDto) {
    return `This action updates a #${id} lead`;
  }

  remove(id: number) {
    return `This action removes a #${id} lead`;
  }
}
