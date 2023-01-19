import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';
import { CourseModule } from './course/course.module';
import { LeadsModule } from './leads/leads.module';
import { InstrumentModule } from './instrument/instrument.module';
import { OrderModule } from './order/order.module';
import { SettingModule } from './setting/setting.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(TypeOrmConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'bots'),
    }),
    MulterModule.register({
      dest: '../uploads',
    }),
    CourseModule,
    LeadsModule,
    InstrumentModule,
    OrderModule,
    SettingModule,
    AuthModule
  ]
})
export class AppModule {}
