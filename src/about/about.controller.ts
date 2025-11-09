// src/about/about.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AboutService } from './about.service';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
import { QueryAboutDto } from './dto/query-about.dto';

@Controller('about')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AboutController {
  constructor(private readonly service: AboutService) {}

  @Post()
  create(@Body() dto: CreateAboutDto) {
    // upsert بر اساس languageId
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() q: QueryAboutDto) {
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAboutDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
