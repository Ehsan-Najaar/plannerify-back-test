// schedule.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepo: Repository<Schedule>,
  ) {}

  findAll() {
    return this.scheduleRepo.find();
  }

  create(dto: CreateScheduleDto) {
    try {
      const schedule = this.scheduleRepo.create(dto);
      return this.scheduleRepo.save(schedule);
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  }

  async update(id: number, dto: CreateScheduleDto) {
    await this.scheduleRepo.update(id, dto);
    const updated = await this.scheduleRepo.findOneBy({ id });
    if (!updated) throw new Error('Schedule not found after update');
    return updated;
  }

  remove(id: number) {
    return this.scheduleRepo.delete(id);
  }
}
