import { Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';
const fse = require('fs-extra')
import axios from 'axios';
import path from 'path';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)  
    private SettingRepository: Repository<Setting>,
    ) {}

  async create(createSettingDto: CreateSettingDto) {
    try {
      const response = await axios.get(`https://api.telegram.org/bot${createSettingDto.bot_token}/getMe`)

      let data = response.data;
      let bot_path = process.cwd()+`/bots/bot_${data.result?.id}.js`;

      fse.copySync(process.cwd()+'/bots/bot.js', bot_path)
      createSettingDto.path = bot_path;
      createSettingDto.bot_username = 'https://t.me/'+data.result?.username;
      createSettingDto.status = 1;
      let new_bot = this.SettingRepository.create(createSettingDto);
      await new_bot.save() 

    } catch (error) {
      if (error.code == 'ERR_BAD_REQUEST') throw new UnauthorizedException(error.message);
    }
    
  }

  async findAll() {
    return await this.SettingRepository.find();
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
