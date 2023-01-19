import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';
const fse = require('fs-extra')
import axios from 'axios';
import path from 'path';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)  
    private SettingRepository: Repository<Setting>,
    ) {}

  async create(createSettingDto: CreateSettingDto): Promise<void> {
    let find_bot = await this.SettingRepository.find();
    if (find_bot.length != 0) throw new ConflictException("bot exist") 

    try {
      const response = await axios.get(`https://api.telegram.org/bot${createSettingDto.bot_token}/getMe`)

      let data = response.data;
      let to_path = process.cwd() + `../../bots.sales-up.uz/${data.result?.id}.js`
      fse.copySync(process.cwd()+'/bots/bot.js', to_path)
      createSettingDto.path = to_path;
      createSettingDto.bot_username = 'https://t.me/'+data.result?.username;
      createSettingDto.bot_chat_id = data.result?.id;
      createSettingDto.status = 1;
      let new_bot = this.SettingRepository.create(createSettingDto);
      await new_bot.save() 

    } catch (error) {
      if (error.code == 'ERR_BAD_REQUEST') throw new BadRequestException(error.message);
    }
    
  }

  async findAll(): Promise<Setting[]> {
    let all_bots = await this.SettingRepository.find();
    if(all_bots.length == 0) throw new NotFoundException();
    return all_bots;
  }

  async Webhook_bot(id: number): Promise<void> {
    
    let tg_bot = await this.SettingRepository.findOneBy({ id });
    if (tg_bot == null) throw new NotFoundException("ID");

    try {
      await axios.get(`https://api.telegram.org/bot${tg_bot.bot_token}/setWebhook?remove`);
      await axios.get(`https://api.telegram.org/bot${tg_bot.bot_token}/setWebhook?url=${tg_bot.path}`);
    } catch (error) {
      if (error.code == 'ERR_BAD_REQUEST') throw new BadRequestException(error.message);
    }
  }



  async remove(id: number): Promise<void> {
    let tg_bot = await this.SettingRepository.findOneBy({ id });
    if (tg_bot == null) throw new NotFoundException("ID");

    try {
      await axios.get(`https://api.telegram.org/bot${tg_bot.bot_token}/setWebhook?remove`); 
      await this.SettingRepository.remove(tg_bot);
    } catch (error) {
      if (error.code == 'ERR_BAD_REQUEST') throw new BadRequestException(error.message);
    }
  }

  async send_message (sendMessageDto: SendMessageDto) {
    let tg_bot = await this.SettingRepository.findOneBy({ id: 1 });
    try {
      await axios.get(`https://api.telegram.org/bot${tg_bot.bot_token}/sendmessage?chat_id=5356014595&text=${sendMessageDto.message}&parse_mode=html`) 
    } catch (error) {
      if (error.code == 'ERR_BAD_REQUEST') throw new BadRequestException(error.message);
    } 
  }
}
