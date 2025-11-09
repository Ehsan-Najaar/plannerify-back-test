// src/goals/goals.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal) private goalRepository: Repository<Goal>,
  ) {}

  private calculateProgress(tasks: { completed: boolean }[]): number {
    if (!tasks || tasks.length === 0) return 0;
    const completedCount = tasks.filter((t) => t.completed).length;
    return Math.round((completedCount / tasks.length) * 100);
  }

  async create(createGoalDto: CreateGoalDto, userId: number) {
    const progress = this.calculateProgress(createGoalDto.tasks);
    const goal = this.goalRepository.create({
      ...createGoalDto,
      userId,
      progress,
    });
    return this.goalRepository.save(goal);
  }

  findAll(userId: number) {
    return this.goalRepository.find({
      where: { userId },
      order: { id: 'DESC' },
    });
  }

  async update(id: number, updateGoalDto: UpdateGoalDto, userId: number) {
    const goal = await this.goalRepository.findOne({
      where: { id, userId },
    });

    if (!goal) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }

    goal.title = updateGoalDto.title ?? goal.title;
    goal.description = updateGoalDto.description ?? goal.description;
    goal.date = updateGoalDto.date ?? goal.date;
    goal.tasks = updateGoalDto.tasks ?? goal.tasks;
    goal.progress = this.calculateProgress(goal.tasks);

    return this.goalRepository.save(goal);
  }

  async remove(id: number, userId: number) {
    return this.goalRepository.delete({ id, userId });
  }
}
