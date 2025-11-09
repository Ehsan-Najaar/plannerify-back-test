import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan, PlanSettings } from './plan.entity';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, PlanSettings])],
  providers: [PlanService],
  controllers: [PlanController],
  exports: [TypeOrmModule],
})
export class PlanModule {}
