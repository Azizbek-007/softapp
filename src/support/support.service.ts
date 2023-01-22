import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { Support } from './entities/support.entity';

@Injectable()
export class SupportService {
  constructor (
    @InjectRepository(Support)  private SupportRepository: Repository<Support>
  ) {}
  async create(createSupportDto: CreateSupportDto) {
    let new_quetion = this.SupportRepository.create(createSupportDto);
    await new_quetion.save();
  }

  async findAll() {
    let find_all = await this.SupportRepository.findBy({ answer: null });
    if (find_all.length == 0) throw new NotFoundException();
    return find_all;
  }

  findOne(id: number) {
    return `This action returns a #${id} support`;
  }

  async update(id: number, updateSupportDto: UpdateSupportDto) {
    let find_ques = await this.SupportRepository.findOneBy({ id });
    if (find_ques == null) throw new NotFoundException("Not Found Question");
    await this.SupportRepository.update(find_ques.id, updateSupportDto);
  }

  remove(id: number) {
    return `This action removes a #${id} support`;
  }
}
