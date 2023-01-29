import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';
import { Instrument } from './entities/instrument.entity';
import { generate } from 'short-uuid';
import { Setting } from 'src/setting/entities/setting.entity';
import { InstrumentTypeEnum } from './intrument.enum';

@Injectable()
export class InstrumentService {
  constructor(
    @InjectRepository(Instrument)
    private InstrumentRepository: Repository<Instrument>,
    @InjectRepository(Setting)
    private SettingRepository: Repository<Setting>,
  ) {}

  async create(createInstrumentDto: CreateInstrumentDto, host: string) {
    const bot_info = await this.SettingRepository.findOneBy({ id: 1 });
    const hash_uuid = generate();
    if (createInstrumentDto.type == InstrumentTypeEnum.telegram_bot) {
      createInstrumentDto.link = bot_info.bot_username + '?start=' + hash_uuid;
      createInstrumentDto.code = hash_uuid;
    } else {
      createInstrumentDto.link = `http://${host}/api/v1/?share=` + hash_uuid;
      createInstrumentDto.code = hash_uuid;
    }

    const new_link = this.InstrumentRepository.create(createInstrumentDto);
    await new_link.save();
    return new_link;
  }

  async findAll(query) {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;

    const [data, total] = await this.InstrumentRepository.findAndCount({
      cache: true,
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

  findOne(id: number) {
    return `This action returns a #${id} instrument`;
  }

  async update(id: number, updateInstrumentDto: UpdateInstrumentDto) {
    const one_link = await this.InstrumentRepository.findOneBy({ id });

    if (one_link == null) {
      throw new NotFoundException();
    }
    await this.InstrumentRepository.update(one_link.id, {
      clicked: one_link.clicked + 1,
      distribution: one_link.price / (one_link.clicked + 1),
    });
  }

  async remove(id: number) {
    const one_link = await this.InstrumentRepository.findOneBy({ id });
    if (one_link == null) {
      throw new NotFoundException();
    }
    await one_link.softRemove();
  }
}
