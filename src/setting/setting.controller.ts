import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@UseGuards(AuthGuard('jwt'))
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingService.create(createSettingDto);
  }

  @Get()
  findAll() {
    return this.settingService.findAll();
  }

  // @Get('webhook')
  // webhook_bot() {
  //   return this.settingService.Webhook_bot();
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingService.remove(+id);
  }

  @Post('sendMessage')
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads'
    }),
    fileFilter: (req, file, cb) => {
      file.filename = Date.now() + '-' +file.originalname ;
      cb(null, true);
    },
  }))

  sendMesage(@UploadedFile() file: Express.Multer.File, @Body() sendMessageDto: SendMessageDto) {
    console.log(file)
    console.log(sendMessageDto)
    return this.settingService.send_message(sendMessageDto);
  }
}
