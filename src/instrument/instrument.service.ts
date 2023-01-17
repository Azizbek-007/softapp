import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';
import { Instrument } from './entities/instrument.entity';
import { generate } from 'short-uuid';

@Injectable()
export class InstrumentService {
  constructor (
    @InjectRepository(Instrument) private InstrumentRepository: Repository<Instrument>
  ) {}

  async create(createInstrumentDto: CreateInstrumentDto) { 
    createInstrumentDto.link = generate(); 
    let new_link = this.InstrumentRepository.create(createInstrumentDto);
    await new_link.save();
    return new_link;
  }

  async findAll(): Promise<Instrument[]> {
    let all_links = await this.InstrumentRepository.find();
    if (all_links.length == 0) {
      throw new NotFoundException();
    }
    return all_links;
  }

  findOne(id: number) {
    return `This action returns a #${id} instrument`;
  }

  async update(id: number, updateInstrumentDto: UpdateInstrumentDto) {
    let one_link = await this.InstrumentRepository.findOneBy({ id });
    if (one_link == null) {
      throw new NotFoundException();
    }
    await this.InstrumentRepository.update(id, {
      clicked: one_link.clicked + 1
    });
  }

  async remove(id: number) {
    let one_link = await this.InstrumentRepository.findOneBy({ id });
    if (one_link == null) {
      throw new NotFoundException();
    }
    await this.InstrumentRepository.remove(one_link);
  }
}
