import { Controller, Get, Post, Body, Param, Delete, UseGuards, Patch, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

// @UseGuards(AuthGuard('jwt'))
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('all')
  findAllCourse () {
    return this.courseService.findAll_public();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Query() query) {
    return this.courseService.findAll(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
