import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTaskDto, TaskResponseDto } from './task.dto';
import { TaskService } from './task.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
  };
}

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getAllTasks(@Req() req: AuthenticatedRequest) {
    const allTasks = await this.taskService.getAll(req.user.id);
    return plainToClass(TaskResponseDto, allTasks);
  }

  @Get('by-date')
  async getByDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.taskService.getByDate(startDate, endDate, req.user.id);
  }

  // ✅ unified overview endpoint
  @Get('overview')
  async taskOverview(@Req() req: AuthenticatedRequest) {
    return this.taskService.getTaskStats(req.user.id);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: number, @Req() req: AuthenticatedRequest) {
    const task = await this.taskService.getById(id, req.user.id);
    return plainToClass(TaskResponseDto, task);
  }

  @Patch()
  async toggleDone(@Body('id') id: number, @Req() req: AuthenticatedRequest) {
    return await this.taskService.toggleDone(id, req.user.id);
  }

  @Patch('sort/:id')
  async changeSort(
    @Param('id') id: number,
    @Body('sort') sort: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.taskService.changeSort(id, sort, req.user.id);
  }

  @Put(':id')
  async editTask(
    @Param('id') id: number,
    @Body(new ValidationPipe()) body: CreateTaskDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto> {
    const result = await this.taskService.editTask(body, id, req.user.id);
    return plainToClass(TaskResponseDto, result);
  }

  @Post()
  async createTask(
    @Body(new ValidationPipe()) body: CreateTaskDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto> {
    const result = await this.taskService.createTask(body, req.user.id);
    return plainToClass(TaskResponseDto, result);
  }

  @Delete()
  async deleteTask(@Body('id') id: number, @Req() req: AuthenticatedRequest) {
    return await this.taskService.deleteTask(id, req.user.id);
  }

  @Delete('by-date')
  async deleteTaskByDate(
    @Body('startDate') startDate: string,
    @Body('endDate') endDate: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.taskService.deleteTaskByDate(
      startDate,
      endDate,
      req.user.id,
    );
  }
}
