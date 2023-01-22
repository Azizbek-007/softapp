import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instrument } from 'src/instrument/entities/instrument.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Instrument ])],
  controllers: [ShareController],
  providers: [ShareService]
})
export class ShareModule {}
