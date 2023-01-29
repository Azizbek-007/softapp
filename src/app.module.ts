import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';
import { CourseModule } from './course/course.module';
import { LeadsModule } from './leads/leads.module';
import { InstrumentModule } from './instrument/instrument.module';
import { OrderModule } from './order/order.module';
import { SettingModule } from './setting/setting.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { SupportModule } from './support/support.module';
import { ShareModule } from './share/share.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(TypeOrmConfig),
    MulterModule.register({
      dest: '../uploads', // upload adress
    }),
    CourseModule,
    LeadsModule,
    InstrumentModule,
    OrderModule,
    SettingModule,
    AuthModule,
    SupportModule,
    ShareModule,
  ],
})
export class AppModule {}
