import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';
import axios from 'axios';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)  
    private SettingRepository: Repository<Setting>
  ) {}

  async create(createSettingDto: CreateSettingDto) {
    axios.get(`https://api.telegram.org/bot${createSettingDto.bot_token}/getMe`)
      .then(function (response) {
      if (response.status == 200) {
        this.SettingRepository.create()
      }
    })
    .catch(function (error) {
    console.log(error);
    })
  
  }

  findAll() {
    return `This action returns all setting`;
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return `This action updates a #${id} setting`;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
