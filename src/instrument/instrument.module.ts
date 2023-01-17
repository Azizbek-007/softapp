import { Module } from '@nestjs/common';
import { InstrumentService } from './instrument.service';
import { InstrumentController } from './instrument.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instrument } from './entities/instrument.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Instrument]),
    AuthModule
  ],
  controllers: [InstrumentController],
  providers: [InstrumentService]
})
export class InstrumentModule {}
