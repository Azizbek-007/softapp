import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';
import { User } from 'src/auth/entities/auth.entity';

@Module({
  imports:[
            TypeOrmModule.forFeature([ Setting, User ]),
          ],
  controllers: [SettingController],
  providers: [SettingService]
})
export class SettingModule {}
