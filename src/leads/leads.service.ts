import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { IsNull, Not, Repository } from 'typeorm';
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
    let find = await this.LeadRepository.find();
    if (find.length == 0) {
      throw new NotFoundException();
    }
    return find;
  }

  async update(id: number, updateLeadDto: UpdateLeadDto) {
    let find = await this.LeadRepository.findOneBy({ id });
    if (!find) {
      throw new NotFoundException();
    }
    await this.LeadRepository.update(id, updateLeadDto);
  }

  async remove(id: number) {
    let find = await this.LeadRepository.findOneBy({ id });
    if (!find) {
      throw new NotFoundException();
    }
    await this.LeadRepository.remove(find);
  }
}
