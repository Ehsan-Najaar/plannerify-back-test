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
import { CreateTermsDto } from './dto/create-terms.dto';
import { UpdateTermsDto } from './dto/update-terms.dto';
import { QueryTermsDto } from './dto/query-terms.dto';
import { TermsService } from './terms.service';

@Controller('terms')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class TermsController {
  constructor(private readonly service: TermsService) {}

  @Post()
  create(@Body() dto: CreateTermsDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() q: QueryTermsDto) {
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTermsDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
