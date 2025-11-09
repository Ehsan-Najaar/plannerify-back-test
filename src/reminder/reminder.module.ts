// reminder/reminder.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderService } from './reminder.service';
import { Plan, PlanSettings } from 'src/plans/plan.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, PlanSettings, User])],
  providers: [ReminderService],
})
export class ReminderModule {}
