import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lead } from 'src/leads/entities/lead.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor (
    @InjectRepository(Order) private OrderRepository: Repository<Order>,
    @InjectRepository(Lead) private LeadRepository: Repository<Lead>
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    let lead = await this.LeadRepository.findOneBy({ id: createOrderDto.id });
   
    if (!lead) throw new NotFoundException(`Not found lead id ${createOrderDto.id}`);

    let new_order = this.OrderRepository.create({
      user_id: lead.user_id,
      FIO: lead.FIO,
      phone: lead.phone,
      utm: lead.utm,
      status: lead.status,
      comment: createOrderDto.comment,
      course: createOrderDto.course
    });
    try {
      await new_order.save();
      return new_order;
    } catch (error) {
      if (error['code'] == 'ER_NO_REFERENCED_ROW_2') {
        throw new NotFoundException("Not found course id " + createOrderDto.course);
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    let find_order =  await this.OrderRepository.findBy({
      course: Not(IsNull())
    });
  
    if(find_order.length == 0) {
      throw new NotFoundException()
    };
    return find_order;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    let find_order = await this.OrderRepository.findOneBy({ id });
    if (find_order == null) {
      throw new NotFoundException();
    }
    try {
      await this.OrderRepository.update(id, updateOrderDto);
    } catch (error) {
      if (error['errno'] == 1452){
        throw new NotFoundException("Not Found cours")
      }
    }
  }

  async remove(id: number) {
    let find_order =  await this.OrderRepository.findOneBy({
      id: id,
    });
    if (find_order == null) {
      throw new NotFoundException();
    }
    await find_order.softRemove();
  }
}
