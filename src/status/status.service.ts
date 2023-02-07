import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from './entities/status.entity';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private StatusRepository: Repository<Status>
  ){}

  async create(createStatusDto: CreateStatusDto) {
    const newStatus = this.StatusRepository.create(createStatusDto);
    await newStatus.save()
  }

  async findAll() {
    const allStatus = await this.StatusRepository.find()
    if (allStatus.length == 0) throw new NotFoundException()
    return { data: allStatus };
  }

  async update(id: number, updateStatusDto: UpdateStatusDto) {
    const find = await this.StatusRepository.findBy({ id });
    if(find.length == 0) throw new NotFoundException();
    await this.StatusRepository.update(id, updateStatusDto);
  }

  async remove(id: number) {
    const find = await this.StatusRepository.findBy({ id });
    if(find.length == 0) throw new NotFoundException();
    await this.StatusRepository.remove(find);
  }
}
