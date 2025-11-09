import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { IdeasService } from './ideas.service';
import { AuthGuard } from 'src/auth/auth.guard';

import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
  };
}

@Controller('idea')
@UseGuards(AuthGuard)
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createIdeaDto: CreateIdeaDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ideasService.create(createIdeaDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.ideasService.findAll(req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateIdeaDto: UpdateIdeaDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ideasService.update(+id, updateIdeaDto, req.user.id);
  }

  @Delete()
  remove(@Body('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.ideasService.remove(+id, req.user.id);
  }
}
