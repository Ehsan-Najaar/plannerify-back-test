// src/goals/goals.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalsService } from './goals.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
  };
}

@Controller('goal')
@UseGuards(AuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createGoalDto: CreateGoalDto,
    @Req() req: AuthenticatedRequest,
  ) {
    console.log('Received body:', JSON.stringify(createGoalDto, null, 2));
    return this.goalsService.create(createGoalDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.goalsService.findAll(req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateGoalDto: UpdateGoalDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.goalsService.update(+id, updateGoalDto, req.user.id);
  }

  @Delete()
  remove(@Body('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.goalsService.remove(+id, req.user.id);
  }
}
