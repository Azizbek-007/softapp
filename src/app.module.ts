import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfig } from './config/typeorm.config';
import { CourseModule } from './course/course.module';
import { LeadsModule } from './leads/leads.module';
import { InstrumentModule } from './instrument/instrument.module';
import { SettingsModule } from './settings/settings.module';
import { OrderModule } from './order/order.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(TypeOrmConfig),
    CourseModule,
    LeadsModule,
    InstrumentModule,
    SettingsModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
