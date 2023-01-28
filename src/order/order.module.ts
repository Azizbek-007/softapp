import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Lead } from 'src/leads/entities/lead.entity';
import { AuthModule } from 'src/auth/auth.module';
import { OrderLeadPublic } from './order_lead.service';
import { Instrument } from 'src/instrument/entities/instrument.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Lead, Instrument]), 
    AuthModule
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderLeadPublic]
})
export class OrderModule {}
