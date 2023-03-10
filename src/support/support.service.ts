import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Setting } from 'src/setting/entities/setting.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { Support } from './entities/support.entity';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(Support) private SupportRepository: Repository<Support>,
    @InjectRepository(Setting) private SettingRepository: Repository<Setting>,
  ) {}
  async create(createSupportDto: CreateSupportDto) {
    const new_quetion = this.SupportRepository.create(createSupportDto);
    await new_quetion.save();
  }

  async findAll() {
    const find_all = await this.SupportRepository.find({
      cache: true,
      where: { answer: IsNull() },
      order: { id: 'DESC' },
    });
    if (find_all.length == 0) throw new NotFoundException();
    return find_all;
  }

  async answeredAll() {
    const find_all = await this.SupportRepository.find({
      cache: true,
      where: { answer: Not(IsNull()) },
      order: { id: 'DESC' },
    });
    if (find_all.length == 0) throw new NotFoundException();
    return find_all;
  }

  async SupportChat(user_id: string) {
    try {
      const findall_questions = await this.SupportRepository.findBy({
        user_id,
      });
      if (findall_questions == null) throw new NotFoundException();
      return findall_questions;
    } catch (error) {
      return error;
    }
  }

  async update(id: number, updateSupportDto: UpdateSupportDto) {
    const find_ques = await this.SupportRepository.findOneBy({ id });
    if (find_ques == null) throw new NotFoundException('Not Found Question');

    const tg_bot = await this.SettingRepository.findOneBy({ id: 1 });
    if (find_ques == null)
      throw new NotFoundException('Not connected telegram bot');

    try {
      await axios.get(
        `https://api.telegram.org/bot${tg_bot.bot_token}/sendmessage?chat_id=${find_ques.user_id}&text=${updateSupportDto.answer}&reply_to_message_id=${find_ques.message_id}&parse_mode=html`,
      );
      await this.SupportRepository.update(find_ques.id, updateSupportDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} support`;
  }
}
