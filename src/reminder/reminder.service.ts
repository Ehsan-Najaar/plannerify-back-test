// reminder/reminder.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan, PlanSettings } from 'src/plans/plan.entity';
import { User } from 'src/users/user.entity';
import { sendEmail } from 'src/utils';
import { Repository } from 'typeorm';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    @InjectRepository(Plan) private plans: Repository<Plan>,
    @InjectRepository(PlanSettings) private settings: Repository<PlanSettings>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  async runDailyReminders() {
    this.logger.log('Running plan reminders...');

    const notifyUsers = await this.settings.find({
      where: { notification: true },
      select: ['userId'],
    });
    if (!notifyUsers.length) return;

    const userIds = notifyUsers.map((s) => s.userId);

    const now = new Date();
    const todayISO = now.toISOString().slice(0, 10);

    const startOfTodayUTC = new Date(`${todayISO}T00:00:00.000Z`);

    const qb = this.plans
      .createQueryBuilder('p')
      .where('p.done = :done', { done: false })
      .andWhere('p.userId IN (:...userIds)', { userIds })
      .andWhere('p.dueDate IS NOT NULL')
      .andWhere('p.dueDate <= :today', { today: todayISO })
      .andWhere('(p.lastNotifiedAt IS NULL)', {
        startOfToday: startOfTodayUTC,
      })
      .orderBy('p.dueDate', 'ASC');

    const plans = await qb.getMany();

    this.logger.log(plans);
    if (!plans.length) return;

    for (const plan of plans) {
      try {
        await this.sendReminderEmail(plan);

        plan.lastNotifiedAt = new Date();
        await this.plans.save(plan);
      } catch (e) {
        this.logger.error(
          `Failed to send reminder for plan ${plan.id}`,
          e as any,
        );
      }
    }
  }

  private async sendReminderEmail(plan: Plan) {
    const user = await this.users.findOne({ where: { id: plan.userId } });

    sendEmail(user.email, 'Plan Reminder', this.buildHtml(plan));
  }

  private buildHtml(plan: Plan) {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const due = plan.dueDate ? new Date(plan.dueDate).toDateString() : 'N/A';
    return `
      <div style="font-family:ui-sans-serif,system-ui;line-height:1.6">
        <h2 style="margin:0 0 8px">Plan reminder</h2>
        <p><strong>Title:</strong> ${escapeHtml(plan.title)}</p>
        <p><strong>Due date:</strong> ${due}</p>
        <p>${escapeHtml(plan.description || '')}</p>
      </div>
    `;
  }
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
