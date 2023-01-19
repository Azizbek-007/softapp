import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { Course } from 'src/course/entities/course.entity';
import { Instrument } from 'src/instrument/entities/instrument.entity';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead } from './entities/lead.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private LeadRepository: Repository<Lead>,
    @InjectRepository(Instrument) private InstrumentRepository: Repository<Instrument>
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    let inst_hash = createLeadDto.instrument;
    let inst = await this.InstrumentRepository.findOneBy({ code: inst_hash })
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

  async findAll(querys) {
    if(querys.from && querys.to) {
      let find =  this.LeadRepository.createQueryBuilder('leads_cm')
      .where(`leads_cm.created_at >= '${querys.from}' AND leads_cm.created_at <= '${querys.to}'`)
      .getMany()
      if (find == null) {
        throw new NotFoundException();
      }
      return find

    }else if (querys.name && querys.phone) {
      let find = await this.LeadRepository.findBy({ FIO: querys.name, phone: '+'+querys.phone });
      if (find.length == 0) {
        throw new NotFoundException();
      }
      return find;
    }

    let find = await this.LeadRepository.find();
    if (find.length == 0) {
      throw new NotFoundException();
    }
    return find;
    
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
