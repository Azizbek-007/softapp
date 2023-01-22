import { Injectable } from '@nestjs/common';
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

  findAll() {
    return `This action returns all support`;
  }

  findOne(id: number) {
    return `This action returns a #${id} support`;
  }

  update(id: number, updateSupportDto: UpdateSupportDto) {
    return `This action updates a #${id} support`;
  }

  remove(id: number) {
    return `This action removes a #${id} support`;
  }
}
