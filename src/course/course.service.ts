import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  async create(createCourseDto: CreateCourseDto) {
    let course = this.CoureRepository.create({
      name: createCourseDto.name,
      clicked: 0
    });

    try {
      await course.save();
      return course
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

  }

  async findAll() {
    let courses = await this.CoureRepository.find();
    if (courses.length == 0) {
      throw new NotFoundException();
    }
    return courses;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    let find = await this.CoureRepository.findOneBy({ id });
    if (!find) {
      throw new NotFoundException();
    }
    await this.CoureRepository.update(id, {
      clicked: find.clicked + 1
    });
    return find;
  }

  async remove(id: number) {
    let find = await this.CoureRepository.findOneBy({ id });
    if (!find) {
      throw new NotFoundException();
    }
    await find.remove();
  }
}
