import { ForbiddenException, Injectable, InternalServerErrorException, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
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
    let course = this.CoureRepository.create(createCourseDto);

    try {
      await course.save();
      return course
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

  }

  async findOne(id: number): Promise<Course> {
    let find = await this.CoureRepository.findOneBy({ id });
    if (!find) {
      throw new NotFoundException();
    }
    return find;
  }

  async findAll(): Promise<Course[]> {
    let courses = await this.CoureRepository.find({ 
      order: { 'id': 'DESC'}
    });
    if (courses.length == 0) {
      throw new NotFoundException();
    }
    return courses;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    let find = await this.CoureRepository.findOneBy({ id });
    if (!find) {
      throw new NotFoundException();
    }
    await this.CoureRepository.update(id, {
      clicked: find.clicked + 1
    });
    return find;
  }

  async remove(id: number): Promise<void> {
    let find = await this.CoureRepository.findOneBy({ id });
    if (!find) {
      throw new NotFoundException();
    }
    try {
      await find.remove(); 
    } catch (error) {
      if (error['errno'] == 1451){
        throw new MethodNotAllowedException()
      }
      throw new InternalServerErrorException(error);
    }
  }
}
