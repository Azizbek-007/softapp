import { Module } from '@nestjs/common';
import { InstrumentService } from './instrument.service';
import { InstrumentController } from './instrument.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instrument } from './entities/instrument.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Setting } from 'src/setting/entities/setting.entity';
import { Lead } from 'src/leads/entities/lead.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Instrument, Setting, Lead]), AuthModule],
  controllers: [InstrumentController],
  providers: [InstrumentService],
})
export class InstrumentModule {}
