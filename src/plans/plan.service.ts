import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan, PlanSettings } from './plan.entity';
import { CreatePlanDto, PlanSettingsDto } from './plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
    @InjectRepository(PlanSettings)
    private planSettingsRepository: Repository<PlanSettings>,
  ) {}

  async getAll(userId: number) {
    return this.planRepository.find({ where: { userId } });
  }

  async toggleDone(id: number, userId: number) {
    const plan = await this.planRepository.findOne({ where: { id, userId } });
    if (!plan) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    plan.done = !plan.done;

    return this.planRepository.save(plan);
  }

  async createPlan(data: CreatePlanDto, userId: number) {
    const { title, description, dueDate, category, priority } = data;

    return this.planRepository.save({
      title,
      description,
      dueDate,
      category,
      priority,
      done: false,
      userId,
    });
  }
  async editPlan(data: CreatePlanDto, id: number, userId: number) {
    const plan = await this.planRepository.findOne({ where: { id, userId } });
    if (!plan) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }

    const editedPlan = await this.planRepository.save({
      ...plan,
      ...data,
    });

    return editedPlan;
  }
  async deletePlan(id: number, userId: number) {
    return await this.planRepository.delete({ id, userId });
  }

  async updatePlanSettings(data: PlanSettingsDto, userId: number) {
    const planSettings = await this.planSettingsRepository.findOne({
      where: { userId },
    });
    planSettings.notification = data?.notification || false;
    planSettings.priorityColors = data?.priorityColors || false;

    this.planSettingsRepository.save(planSettings);
  }

  async getPlanSettings(userId: number) {
    const planSettings = await this.planSettingsRepository.findOne({
      where: { userId },
    });
    if (!planSettings) {
      return await this.planSettingsRepository.save({
        notification: false,
        priorityColors: false,
        userId,
      });
    }

    return planSettings;
  }
  async planOverview(userId: number) {
    const plans = await this.planRepository.find({ where: { userId } });

    const allPlans = plans.length;
    const donePlans = plans.filter((plan) => plan.done === true).length;
    const overalProgress = Math.floor((donePlans / allPlans) * 100);

    const categories = ['work', 'study', 'gym'];

    let result = {};

    for (let category of categories) {
      const doneCategoryPlans = plans.filter(
        (plan) => plan.category === category && plan.done === true,
      );
      const allCategoryPlans = plans.filter(
        (plan) => plan.category === category,
      );

      result[category] = Math.floor(
        (doneCategoryPlans.length / allCategoryPlans.length) * 100,
      );
    }

    return { result, overalProgress };
  }
}
