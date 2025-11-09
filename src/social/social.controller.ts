// src/socials/socials.controller.ts
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
import { SocialsService } from './social.service';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { QuerySocialDto } from './dto/query-social.dto';

@Controller('socials')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class SocialsController {
  constructor(private readonly service: SocialsService) {}

  @Post()
  create(@Body() dto: CreateSocialDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QuerySocialDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put()
  update(@Body('id', ParseIntPipe) id: number, @Body() dto: UpdateSocialDto) {
    return this.service.update(id, dto);
  }

  @Delete()
  remove(@Body('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
