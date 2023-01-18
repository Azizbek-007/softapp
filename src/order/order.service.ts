import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    createOrderDto.lead_course_id = `${createOrderDto.lead}${createOrderDto.course}`
    let new_order = this.OrderRepository.create(createOrderDto);
    try {
      await new_order.save();
      await this.LeadRepository.update(Number(createOrderDto.lead), {status: 1})
      return new_order;
    } catch (error) {
      if (error['code'] == 'ER_NO_REFERENCED_ROW_2') {
        throw new NotFoundException("Not found course or lead id " + createOrderDto.course);
      }
      if (error['code'] == 'ER_DUP_ENTRY'){
        throw new ConflictException();
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<Order[]> {
    let find_order =  await this.OrderRepository.find();
  
    if(find_order.length == 0) {
      throw new NotFoundException()
    };
    return find_order;
  }

  findOne(id: number): string {
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

  async remove(id: number): Promise<void> {
    let find_order =  await this.OrderRepository.findOneBy({
      id: id,
    });
    if (find_order == null) {
      throw new NotFoundException();
    }
    await this.OrderRepository.remove(find_order);
  }
}
