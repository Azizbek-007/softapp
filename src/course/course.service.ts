import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private CoureRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.CoureRepository.create(createCourseDto);

    try {
      await course.save();
      return course;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number): Promise<Course> {
    const find = await this.CoureRepository.findOneBy({ id });
    if (!find) {
      throw new NotFoundException();
    }
    return find;
  }

  async findAll(query) {
    const { take, skip } = query;
    const [data, total] = await this.CoureRepository.findAndCount({
      order: {
        id: 'DESC',
      },

      take: take,
      skip: skip,
    });

    if (data.length == 0) {
      throw new NotFoundException();
    }

    return { data, total };
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const find = await this.CoureRepository.findOneBy({ id });
    if (!find) {
      throw new NotFoundException();
    }
    await this.CoureRepository.update(id, {
      clicked: find.clicked + 1,
    });
    return find;
  }

  async remove(id: number): Promise<void> {
    const find = await this.CoureRepository.findOneBy({ id });
    if (!find) {
      throw new NotFoundException();
    }
    try {
      await find.remove();
    } catch (error) {
      if (error['errno'] == 1451) {
        throw new MethodNotAllowedException();
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findAll_public() {
    const find = await this.CoureRepository.find({ select: ['id', 'name'] });
    if (!find) throw new NotFoundException();
    return find;
  }
}
