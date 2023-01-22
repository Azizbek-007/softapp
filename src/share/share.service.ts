import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instrument } from 'src/instrument/entities/instrument.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShareService {
  constructor (
    @InjectRepository(Instrument) private InstrumentRepository: Repository<Instrument>,
  ){}
  async add_check(share_code: string) {
    let one_link = await this.InstrumentRepository.findOneBy({ code: share_code });

    if (one_link == null) {
      throw new NotFoundException();
    }
    await this.InstrumentRepository.update(one_link.id, {
      clicked: one_link.clicked + 1,
      distribution: one_link.price/(one_link.clicked +1)
    });
  }
}
