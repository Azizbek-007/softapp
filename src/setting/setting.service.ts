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
    let find_bot = await this.SettingRepository.findOneBy({ id:1 });
    if (find_bot != null) {
      if (find_bot.bot_token != null) throw new ConflictException("bot exist")
      try {
        const response = await axios.get(`https://api.telegram.org/bot${createSettingDto.bot_token}/getMe`)
        let data = response.data;
        let to_path = process.cwd() + `../../../bots.sales-up.uz/bots/${data.result?.id}.js`
        fse.copySync(process.cwd()+'/bots/bot.js', to_path)
        createSettingDto.path = to_path;
        createSettingDto.bot_username = 'https://t.me/'+data.result?.username;
        createSettingDto.bot_chat_id = data.result?.id;
        createSettingDto.status = 1;
        await this.SettingRepository.update(find_bot.id, createSettingDto)
      } catch (error) {
        if (error.code == 'ERR_BAD_REQUEST') throw new BadRequestException(error.message); 
      }
    
    }

    try {
      const response = await axios.get(`https://api.telegram.org/bot${createSettingDto.bot_token}/getMe`)

      let data = response.data;
      let to_path = process.cwd() + `../../../bots.sales-up.uz/bots/${data.result?.id}.js`
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

  async findAll() {
    let tg_bot = await this.SettingRepository.findOneBy({id:1});
    if(tg_bot.bot_token == null) throw new NotFoundException();
    return tg_bot;
  }

  async Webhook_bot(id: number): Promise<void> {
    
    let tg_bot = await this.SettingRepository.findOneBy({ id });
    if (tg_bot.bot_token == null) throw new NotFoundException("ID");

    try {
      await axios.get(`https://api.telegram.org/bot${tg_bot.bot_token}/setWebhook?remove`);
      await axios.get(`https://api.telegram.org/bot${tg_bot.bot_token}/setWebhook?url=${tg_bot.path}`);
    } catch (error) {
      if (error.code == 'ERR_BAD_REQUEST') throw new BadRequestException(error.message);
    }
  }



  async remove(): Promise<void> {
    let tg_bot = await this.SettingRepository.findOneBy({ id: 1 });
    if (tg_bot == null) throw new NotFoundException("ID");
    try {
      await this.SettingRepository.update(tg_bot.id, { bot_token: null, bot_username: null, bot_chat_id: null, path: null }); 
    } catch (error) {
      if (error.code == 'ERR_BAD_REQUEST') throw new BadRequestException(error.message);
    }
  }

  async send_message (sendMessageDto: SendMessageDto) {
    sendMessageDto.user_id.replace(' ', '');
    var user_id_array = sendMessageDto.user_id.split(',')
    let tg_bot = await this.SettingRepository.findOneBy({ id: 1 });
    try {
      let c = 0

      for await (const num of user_id_array) {
        try {
          await axios.get(`https://api.telegram.org/bot5800302267:AAEDqDZOxrWfxwaTtQviRRSWaMHd5ludg0o/sendmessage?chat_id=${num}&text=${sendMessageDto.message}&parse_mode=html`)     
          c +=1;
        } catch (error) {
          console.log('no send')
        }
      }
      return {send: c}
    } catch (error) {
      if (error.code == 'ERR_BAD_REQUEST') throw new BadRequestException(error.message);
    } 
  }
}
