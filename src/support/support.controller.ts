import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  create(@Body() createSupportDto: CreateSupportDto) {
    return this.supportService.create(createSupportDto);
  }

  @Get()
  findAll() {
    return this.supportService.findAll();
  }

  @Get('answered')
  findAnsweredAll() {
    return this.supportService.answeredAll();
  }

  @Get('/chat/:user_id')
  OpenChat(@Param('user_id') user_id: string) {
    return this.supportService.SupportChat(user_id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupportDto: UpdateSupportDto) {
    return this.supportService.update(+id, updateSupportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supportService.remove(+id);
  }
}
