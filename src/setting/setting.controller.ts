import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, ParseFilePipeBuilder, HttpStatus, HttpException, Req, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { imageFileFilter } from './file-helpler';
import { FileUploadService } from './file.s3.service';
import { extname } from 'path';

@UseGuards(AuthGuard('jwt'))
@Controller('setting')
export class SettingController {
  constructor(
    private readonly settingService: SettingService,
    private readonly FileUploadService: FileUploadService
    ) {}

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

  @Delete()
  remove() {
    return this.settingService.remove();
  }

  @Patch()
  bot_help(@Body() updateDto: UpdateSettingDto) {
    return this.settingService.add_help_text(updateDto);
  }

  @Post('sendMessage')
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req: any, file: any, cb: any) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
      } else {
          cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
      }
    }
  }))
  async sendMesage(@UploadedFile() file: Express.Multer.File, @Body() sendMessageDto: SendMessageDto) {
    let aws_s3_location: string;
    file ? aws_s3_location = await this.FileUploadService.upload(file) : null
    return await this.settingService.send_message(aws_s3_location, sendMessageDto);
  }
}
