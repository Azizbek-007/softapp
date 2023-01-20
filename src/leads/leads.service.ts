import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { Course } from 'src/course/entities/course.entity';
import { Instrument } from 'src/instrument/entities/instrument.entity';
import { Between, IsNull, LessThanOrEqual, Like, MoreThanOrEqual, Not, Raw, Repository } from 'typeorm';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead } from './entities/lead.entity';
import { LeadsStatus } from './role.enum';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private LeadRepository: Repository<Lead>,
    @InjectRepository(Instrument) private InstrumentRepository: Repository<Instrument>
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    let inst_hash = createLeadDto.instrument || null;
   
    let inst = await this.InstrumentRepository.findOneBy({ code: inst_hash })

    if (inst == null) throw new NotFoundException("Not found instrument");
    createLeadDto.instrument = inst.id;
    let form_lead = this.LeadRepository.create(createLeadDto);
    try {
      await form_lead.save()
      return form_lead;
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('User id already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }  
  }

  async findAll(query) {
   
    const take = query.take || 10
    const page=query.page || 1;
    const skip= (page-1) * take ;
    const keyword = query.name || '';
    
    const phone = query.phone || '';
    const user_id = query.userid || '';
    const from_date = query.from || '2000-01-01';
    const to_Date = query.to || '3000-01-01';
    const [data, total] = await this.LeadRepository.findAndCount(
      {
        where:  { 
          FIO: Like('%' + keyword + '%'), 
          user_id: Like('%' + user_id + '%'),
          phone: Like('%' + phone + '%'), 
          createdAt: Between(from_date, to_Date),
        },
        
        take: take,
        skip: skip
      }
    );

    if (data.length == 0) {
      throw new NotFoundException();
    }

    return {data, total};
  }

  async findOne(user_id: string) {
    let find = await this.LeadRepository.findOneBy({ user_id });
    if (find == null) {
      throw new NotFoundException();
    }
    return find;
  }

  async update(id: number, updateLeadDto: UpdateLeadDto) {
    let lead_id = id || null;
    let find = await this.LeadRepository.findOne({
      where: [
        { id: lead_id },
        { user_id: updateLeadDto.user_id }
      ]
    });
    if (!find) {
      throw new NotFoundException();
    }
    delete updateLeadDto.user_id;
    await this.LeadRepository.update(find.id, updateLeadDto);
    return find.id;
  }

  async remove(id: number) {
    let find = await this.LeadRepository.findOneBy({ id });
    if (!find) {
      throw new NotFoundException();
    }
    await this.LeadRepository.remove(find);
  }
}


