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
var fs = require('fs')
var Client = require('ftp');
@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)  
    private SettingRepository: Repository<Setting>,
    ) {}

  async create(createSettingDto: CreateSettingDto): Promise<void> {
    let find_bot = await this.SettingRepository.findOneBy({ id:1 });
    let php_file_adress = process.cwd() + '/bots/bot.php'
    var c = new Client();



    if (find_bot.bot_token != null) throw new ConflictException("bot exist")
    

    const response = await axios.get(`https://api.telegram.org/bot${createSettingDto.bot_token}/getMe`)
    let data = response.data;
    let to_path = `${data.result?.id}.php`
    let new_php_file_adress = process.cwd() + '/bots/' + to_path;

    fs.readFile(php_file_adress, 'utf8', (err, data) =>{
      if (err) throw new InternalServerErrorException(err);
      let token = createSettingDto.bot_token;
      fs.writeFile(new_php_file_adress, `<?php \n$token = "${token}";\n${data}`,'utf8', (err) => console.log(err));
    });

    var c = new Client();
      c.on('ready', function () {
          c.put(new_php_file_adress, to_path, function(err) {
              if (err) throw new InternalServerErrorException(err);
              c.end();
          });
      });
      
      c.connect({
          host: 'yusupog4.beget.tech',
          user: 'yusupog4_backend',
          password: 'CF*x7bl%',
      });
    //   createSettingDto.path = 'https://intuza.uz/salesup/' + to_path;
    //   console.log(createSettingDto.path)
    //   // await axios.get(`https://api.telegram.org/bot${createSettingDto.bot_token}/setWebhook?remove`);
    //   // await axios.get(`https://api.telegram.org/bot${createSettingDto.bot_token}/setWebhook?url=${createSettingDto.path}`)
    //   createSettingDto.bot_username = 'https://t.me/'+data.result?.username;
    //   createSettingDto.bot_chat_id = data.result?.id;
    //   createSettingDto.status = 1;
    //   await this.SettingRepository.update(find_bot.id, createSettingDto)
    // } catch (error) {
    //   // return error;
    //   if (error.code == 'ERR_BAD_REQUEST') throw new BadRequestException(error.message); 
    // }
    
    

    // try {
    //   const response = await axios.get(`https://api.telegram.org/bot${createSettingDto.bot_token}/getMe`)

    //   let data = response.data;
    //   let to_path = `${data.result?.id}.php`
    //   let new_php_file_adress = '/' + process.cwd() + '/bots/' + to_path;


    //   fs.readFile(php_file_adress, 'utf8', (err, data) =>{
    //     let token = createSettingDto.bot_token;
    //     fs.writeFile(new_php_file_adress, `<?php \n$token = "${token}";\n${data}`,'utf8', (err) => console.log(err));
    //   });

    //   c.on('ready', function () {
    //     c.list( "/", function (err, list) {
    //         if (err) throw err;
    //         console.dir(list);
    //     });
    //     c.put(new_php_file_adress, to_path, function(err) {
    //         if (err) throw err;
    //         c.end();
    //     });
    //   });
    //   c.connect({
    //       host: 'yusupog4.beget.tech',
    //       user: 'yusupog4_salesup',
    //       password: 'CF*x7bl%',
    //   });

    //   createSettingDto.path = 'https://intuza.uz/salesup/' + to_path;
    //   // await axios.get(`https://api.telegram.org/bot${createSettingDto.bot_token}/setWebhook?remove`);
    //   // await axios.get(`https://api.telegram.org/bot${createSettingDto.bot_token}/setWebhook?url=${createSettingDto.path}`)
    //   createSettingDto.bot_username = 'https://t.me/'+data.result?.username;
    //   createSettingDto.bot_chat_id = data.result?.id;
    //   createSettingDto.status = 1;
    //   let new_bot = this.SettingRepository.create(createSettingDto);
    //   await new_bot.save() 

    // } catch (error) {
    //   return error;
    //   if (error.code == 'ERR_BAD_REQUEST') throw new BadRequestException(error.message);
    // }
    
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
    if (tg_bot.bot_token == null) throw new NotFoundException("Bot");
    try {
      await this.SettingRepository.update(tg_bot.id, { bot_token: null, bot_username: null, bot_chat_id: null, path: null }); 
      fs.unlinkSync(tg_bot.path);
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
