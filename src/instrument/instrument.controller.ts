import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InstrumentService } from './instrument.service';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('instrument')
export class InstrumentController {
  constructor(private readonly instrumentService: InstrumentService) {}

  @Post()
  create(@Body() createInstrumentDto: CreateInstrumentDto, @Req() req) {
    return this.instrumentService.create(createInstrumentDto, req.headers.host);
  }

  @Get()
  findAll(@Query() querys) {
    return this.instrumentService.findAll(querys);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instrumentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInstrumentDto: UpdateInstrumentDto,
  ) {
    return this.instrumentService.update(+id, updateInstrumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instrumentService.remove(+id);
  }
}
