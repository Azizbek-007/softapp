import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException} from '@nestjs/common';
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
    let find_bot = await this.SettingRepository.findOneBy({ bot_token: createSettingDto.bot_token });
    if (find_bot) throw new ConflictException("bot exist") 

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

  async findAll(): Promise<Setting[]> {
    let all_bots = await this.SettingRepository.find();
    if(all_bots.length == 0) throw new NotFoundException();
    return all_bots;
  }

  async Webhook_bot(id: number) {
    
    let tg_bot = await this.SettingRepository.findOneBy({ id });
    if (tg_bot == null) throw new NotFoundException("ID");

    try {
      await axios.get(`https://api.telegram.org/bot${tg_bot.bot_token}/setWebhook?remove`);
      const response = await axios.get(`https://api.telegram.org/bot${tg_bot.bot_token}/setWebhook?url=${tg_bot.path}`);
    } catch (error) {
      if (error.code == 'ERR_BAD_REQUEST') throw new UnauthorizedException(error.message);
    }
  }



  async remove(id: number) {
    let tg_bot = await this.SettingRepository.findOneBy({ id });
    if (tg_bot == null) throw new NotFoundException("ID");

    try {
      await axios.get(`https://api.telegram.org/bot${tg_bot.bot_token}/setWebhook?remove`); 
      await this.SettingRepository.remove(tg_bot);
    } catch (error) {
      if (error.code == 'ERR_BAD_REQUEST') throw new UnauthorizedException(error.message);
    }
  }
}
