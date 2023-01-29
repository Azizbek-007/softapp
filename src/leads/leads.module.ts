import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Instrument } from 'src/instrument/entities/instrument.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Instrument]), AuthModule],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
