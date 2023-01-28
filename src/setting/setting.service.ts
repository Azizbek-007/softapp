import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Setting } from './entities/setting.entity';
const fse = require('fs-extra')
import axios from 'axios';
import path from 'path';
import { SendMessageDto } from './dto/send-message.dto';
import { Lead } from 'src/leads/entities/lead.entity';
var fs = require('fs')
var Client = require('ftp');

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private SettingRepository: Repository<Setting>,
    @InjectRepository(Lead)
    private LeadRepository: Repository<Lead>
  ) { }

  async create(createSettingDto: CreateSettingDto): Promise<void> {
    let find_bot = await this.SettingRepository.findOneBy({ id: 1 });
    let php_file_address = process.cwd() + '/bots/bot.php';

    if (find_bot.bot_token != null) throw new ConflictException("bot exist")
    
    let token = createSettingDto.bot_token;
    let bot_id = token.split(':')[0];

    fs.readFile(php_file_address, 'utf8', (err: any, data: any) => {
      if (err) throw new InternalServerErrorException(err);
      fs.writeFile(process.cwd() + `/../../bots.sales-up.uz/bots/${bot_id}.php` , `<?php \n$token = "${token}";\n${data}`, 'utf8', 
      (err) => console.log(err));
    });
    try {
      const response = await axios.get(`https://api.telegram.org/bot${createSettingDto.bot_token}/getMe`);
      await axios.get(`https://api.telegram.org/bot${createSettingDto.bot_token}/setWebhook?remove`);
      createSettingDto.path = `https://bots.sales-up.uz/bots/${bot_id}.php`;
      await axios.get(`https://api.telegram.org/bot${createSettingDto.bot_token}/setWebhook?url=${createSettingDto.path}`);
      createSettingDto.bot_username = 'https://t.me/' + response.data.result?.username;
      createSettingDto.bot_chat_id = response.data.result?.id;
      createSettingDto.status = 1;
      await this.SettingRepository.update(find_bot.id, createSettingDto)
    } catch (error) {
      if (error.code == 'ERR_BAD_REQUEST') throw new BadRequestException(error.message);
    }

  }

  async add_help_text(dto: UpdateSettingDto) {
    let tg_bot = await this.SettingRepository.findOneBy({ id: 1 });
    if (tg_bot.bot_token == null) throw new NotFoundException();
    await this.SettingRepository.update(tg_bot.id, { contact: dto.contact });
  }

  async findAll() {
    let tg_bot = await this.SettingRepository.findOneBy({ id: 1 });
    if (tg_bot.bot_token == null) throw new NotFoundException();
    return tg_bot;
  }

  async Webhook_bot(id: number): Promise<void> {

    const tg_bot = await this.SettingRepository.findOneBy({ id });
    if (tg_bot.bot_token == null) throw new NotFoundException('ID');

    try {
      await axios.get(
        `https://api.telegram.org/bot${tg_bot.bot_token}/setWebhook?remove`
      );
      await axios.get(
        `https://api.telegram.org/bot${tg_bot.bot_token}/setWebhook?url=${tg_bot.path}`,
      );
    } catch (error) {
      if (error.code == 'ERR_BAD_REQUEST')
        throw new BadRequestException(error.message);
    }
  }

  async remove(): Promise<void> {
    let tg_bot = await this.SettingRepository.findOneBy({ id: 1 });
    if (tg_bot.bot_token == null) throw new NotFoundException("Bot");
    try {
      await axios.get(`https://api.telegram.org/bot${tg_bot.bot_token}/setWebhook?remove`);
      await this.SettingRepository.update(tg_bot.id, { 
        bot_token: null, 
        bot_username: null, 
        bot_chat_id: null, 
        path: null,
        contact: null
      });
      fs.unlinkSync(tg_bot.path);
    } catch (error) {
      if (error.code == 'ERR_BAD_REQUEST') throw new BadRequestException(error.message);
    }
  }

  async send_message(filename: string, sendMessageDto: SendMessageDto) {
    let c = 0
    const tg_bot = await this.SettingRepository.findOneBy({ id: 1 });
    if(!sendMessageDto.user_id){
      let users = await this.LeadRepository.findBy({ user_id: Not(IsNull())});
      users.forEach(async (user) => {
        console.log(user.user_id)
        try {
          if (filename == null) {
            await axios.get(
              `https://api.telegram.org/bot${tg_bot.bot_token}/sendmessage?chat_id=${user.user_id}&text=${encodeURI(sendMessageDto.message)}&parse_mode=html`,
            );
          } else {
            await axios.get(
              `https://api.telegram.org/bot${tg_bot.bot_token}/sendphoto?chat_id=${user.user_id}&photo=${filename}&caption=${encodeURI(sendMessageDto.message)}&parse_mode=html`,
            );
          }
          c += 1;
        } catch (error) {
          console.log(error);
        }
      })
      return { send: c };
    }
    sendMessageDto.user_id.replace(' ', '');
    const user_id_array = sendMessageDto.user_id.split(',');
    try {
      for await (const num of user_id_array) {
        try {
          if (filename == null) {
            await axios.get(
              `https://api.telegram.org/bot${tg_bot.bot_token}/sendmessage?chat_id=${num}&text=${encodeURI(sendMessageDto.message)}&parse_mode=html`,
            );
          } else {
            await axios.get(
              `https://api.telegram.org/bot${tg_bot.bot_token}/sendphoto?chat_id=${num}&photo=${filename}&caption=${encodeURI(sendMessageDto.message)}&parse_mode=html`,
            );
          }
          c += 1;
        } catch (error) {
          console.log(error);
        }
      }
      return { send: c };
    } catch (error) {
      if (error.code == 'ERR_BAD_REQUEST')
        throw new BadRequestException(error.message);
    }
  }
}
