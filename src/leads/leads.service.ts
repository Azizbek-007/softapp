import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { Course } from 'src/course/entities/course.entity';
import { Instrument } from 'src/instrument/entities/instrument.entity';
import {
  Any,
  Between,
  IsNull,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
  Raw,
  Repository,
} from 'typeorm';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead } from './entities/lead.entity';
import { LeadsStatus } from './role.enum';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private LeadRepository: Repository<Lead>,
    @InjectRepository(Instrument)
    private InstrumentRepository: Repository<Instrument>,
  ) {}

  async create(createLeadDto: CreateLeadDto) {

    if (createLeadDto.instrument) {
      const find: any = await this.InstrumentRepository.findOneBy({
        code: createLeadDto.instrument,
      });
      const leadDistubationCount = await this.LeadRepository.countBy({ 
        instrument: find.id, 
        phone: Not('0') 
      })

      await this.InstrumentRepository.update(find.id, {
        clicked:leadDistubationCount + 1,
        distribution: find.price / (leadDistubationCount + 1),
      });
      createLeadDto.instrument = find;
    }

    const form_lead = this.LeadRepository.create(createLeadDto);

    try {
      await form_lead.save();
      return form_lead;
    } catch (error) {
      if (error['code'] == 'ER_NO_REFERENCED_ROW_2') {
        throw new NotFoundException(
          'Not found course id ' + createLeadDto.courseId,
        );
      }
      if (error.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('User id already exists');
      }
      throw new InternalServerErrorException(error);
      
    }
  }

  async findAll(query) {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;
    const keyword = query.name || '';
    const course = query.course;
    const phone = query.phone || '';
    const from_date = query.from || '2000-01-01';
    const to_Date = query.to || '3000-01-01';

    const [data, total] = await this.LeadRepository.findAndCount({
      relations: ['instrument', 'real_status'],
      where: {
        FIO: Like('%' + keyword + '%'),
        phone: Like('%' + phone + '%'),
        course,
        createdAt: Between(from_date, to_Date),
      },
      order: {
        id: 'DESC',
      },

      take: take,
      skip: skip,
    });

    if (data.length == 0) {
      throw new NotFoundException();
    }

    return { data, total };
  }

  async findOne(user_id: string) {
    const find = await this.LeadRepository.findOneBy({ user_id: user_id });
    if (find == null) {
      throw new NotFoundException();
    }
    return find;
  }

  async update(id: number, updateLeadDto: UpdateLeadDto) {
    let find: Lead;
    if (updateLeadDto.user_id){
      find = await this.LeadRepository.findOneBy({ user_id: updateLeadDto.user_id });
    } else if (id) {
      find = await this.LeadRepository.findOneBy({ id });
    }
    if (!find) {
      throw new NotFoundException();
    }
    delete updateLeadDto.user_id;
    
    try {
      await this.LeadRepository.update(find.id, updateLeadDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return find.id;
  }

  async remove(id: number) {
    const find = await this.LeadRepository.findOneBy({ id });
    if (!find) {
      throw new NotFoundException();
    }
    await this.LeadRepository.remove(find);
  }

  async ok() {
    return 'ok';
  }
}
