import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';
import { Instrument } from './entities/instrument.entity';
import { generate } from 'short-uuid';
import { Setting } from 'src/setting/entities/setting.entity';

@Injectable()
export class InstrumentService {
  constructor (
    @InjectRepository(Instrument) private InstrumentRepository: Repository<Instrument>,
    @InjectRepository(Setting)  
    private SettingRepository: Repository<Setting>
  ) {}

  async create(createInstrumentDto: CreateInstrumentDto) { 
    let bot_info = await this.SettingRepository.findOneBy({ id: 1 });
    let hash_uuid = generate();
    createInstrumentDto.link = bot_info.bot_username + "?start=" + hash_uuid;
    createInstrumentDto.code = hash_uuid;
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
    console.log(id)
    let one_link = await this.InstrumentRepository.findOneBy({ id });

    if (one_link == null) {
      throw new NotFoundException();
    }
    await this.InstrumentRepository.update(one_link.id, {
      clicked: one_link.clicked + 1,
      distribution: one_link.price/(one_link.clicked +1)
    });
  }

  async remove(id: number) {
    let one_link = await this.InstrumentRepository.findOneBy({ id });
    if (one_link == null) {
      throw new NotFoundException();
    }
    await one_link.softRemove();
  }
}
