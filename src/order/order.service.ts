import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lead } from 'src/leads/entities/lead.entity';
import { Between, IsNull, Like, Not, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private OrderRepository: Repository<Order>,
    @InjectRepository(Lead) private LeadRepository: Repository<Lead>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const lead: Lead = await this.LeadRepository.findOneBy({
      user_id: createOrderDto.user_id,
    });
    if (lead == null) throw new NotFoundException('Not Found lead');
    createOrderDto.lead_course_id = `${lead.id}${createOrderDto.course}`;
    const new_order = this.OrderRepository.create({
      FIO: lead.FIO,
      phone: lead.phone,
      lead: lead,
      course: createOrderDto.course,
      lead_course_id: createOrderDto.lead_course_id,
    });

    try {
      await new_order.save();
      await this.LeadRepository.update(lead.id, { status: 1 });
      throw new HttpException(new_order, HttpStatus.OK);
    } catch (error) {
      if (error['code'] == 'ER_NO_REFERENCED_ROW_2') {
        throw new NotFoundException(
          'Not found course or lead id ' + createOrderDto.course,
        );
      }
      if (error['code'] == 'ER_DUP_ENTRY') {
        throw new ConflictException();
      }
    }
  }

  async findAll(query) {
    const take = query.take || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;
    const name = query.name || '';
    const phone = query.phone || '';

    const from_date = query.from || '2000-01-01';
    const to_Date = query.to || '3000-01-01';

    if (take >= 0 && page == 0)
      throw new BadRequestException('page should not be equal to 0');

    try {
      const [data, total] = await this.OrderRepository.findAndCount({
        relations: {
          lead: true,
          course: true,
        },
        cache: true,
        where: {
          FIO: Like('%' + name + '%'),
          phone: Like('%' + phone + '%'),
          createdAt: Between(from_date, to_Date),
        },
        order: {
          id: 'DESC',
        },

        take: take,
        skip: skip,
      });

      return { data, total };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  findOne(id: number): string {
    return `This action returns a #${id} order`;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const find_order = await this.OrderRepository.findOneBy({ id });
    if (find_order == null) {
      throw new NotFoundException('Not found Order id');
    }
    try {
      await this.OrderRepository.update(id, updateOrderDto);
    } catch (error) {
      if (error['errno'] == 1452) {
        throw new NotFoundException('Not Found cours');
      }
    }
  }

  async remove(id: number): Promise<void> {
    const find_order = await this.OrderRepository.findOneBy({
      id: id,
    });
    if (find_order == null) {
      throw new NotFoundException();
    }
    await this.OrderRepository.remove(find_order);
  }
}
