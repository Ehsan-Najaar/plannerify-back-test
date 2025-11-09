import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Between, Repository } from 'typeorm';
import { CreateTaskDto } from './task.dto';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getAll(userId: number) {
    return this.taskRepository.find({
      where: { userId },
      order: { id: 'DESC' },
    });
  }

  async getById(id: number, userId: number) {
    const task = await this.taskRepository.findOne({ where: { id, userId } });
    if (!task) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    return task;
  }

  async toggleDone(id: number, userId: number) {
    const task = await this.taskRepository.findOne({ where: { id, userId } });
    if (!task) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    task.done = !task.done;
    return this.taskRepository.save(task);
  }

  async changeSort(id: number, sort: number, userId: number) {
    const task = await this.taskRepository.findOne({ where: { id, userId } });
    if (!task) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    task.sort = sort;
    return this.taskRepository.save(task);
  }

  async createTask(data: CreateTaskDto, userId: number) {
    const {
      title,
      description,
      time, // 'HH:mm'
      all,
      date, // 'YYYY-MM-DD'
      notification,
      sort,
      priority,
    } = data;

    const givenDate = moment(date, 'YYYY-MM-DD');
    const startOfWeek = givenDate.clone().startOf('isoWeek');
    const endOfWeek = givenDate.clone().endOf('isoWeek');

    const weekDays = [];
    const day = startOfWeek.clone();
    while (day.isSameOrBefore(endOfWeek)) {
      weekDays.push(day.clone());
      day.add(1, 'day');
    }

    // تابعی برای ساخت تاریخ کامل
    const combineDateTime = (dayMoment: moment.Moment, time?: string) => {
      const date = dayMoment.clone();
      if (time) {
        const [hour, minute] = time.split(':').map(Number);
        date.hour(hour).minute(minute).second(0);
      }
      return date.format('YYYY-MM-DD HH:mm:ss'); // ← خروجی string
    };

    let newTasks: any;

    if (all) {
      newTasks = await Promise.all(
        weekDays.map(async (dayMoment) =>
          this.taskRepository.save({
            title,
            description,
            time,
            notification,
            lastNotifiedTime: '',
            date: combineDateTime(dayMoment, time),
            all,
            sort,
            done: false,
            userId,
            priority,
            day: dayMoment.format('dddd'),
            week: Math.ceil(dayMoment.date() / 7),
          }),
        ),
      );
    } else {
      newTasks = await this.taskRepository.save({
        title,
        description,
        time,
        notification,
        lastNotifiedTime: '',
        date: combineDateTime(givenDate, time), // ← اصلاح شد
        all,
        sort,
        done: false,
        userId,
        priority,
        day: givenDate.format('dddd'),
        week: Math.ceil(givenDate.date() / 7),
      });
    }

    return newTasks;
  }

  async editTask(data: CreateTaskDto, id: number, userId: number) {
    const task = await this.taskRepository.findOne({ where: { id, userId } });
    if (!task) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }

    const givenDate = moment(task.date);
    const startOfWeek = givenDate.clone().startOf('isoWeek');
    const endOfWeek = givenDate.clone().endOf('isoWeek');

    const weekDays = [];
    const day = startOfWeek.clone();

    while (day.isSameOrBefore(endOfWeek)) {
      weekDays.push(day.clone());
      day.add(1, 'day');
    }

    if (data.all) {
      await Promise.all(
        weekDays.map(async (dayMoment) => {
          const newTask = this.taskRepository.create({
            ...task,
            ...data,
            date: dayMoment.format('YYYY-MM-DD'),
            day: dayMoment.format('dddd'),
            week: Math.ceil(dayMoment.date() / 7),
            userId,
          });

          if (!moment(dayMoment).isSame(task.date)) {
            delete newTask.id;
          }

          await this.taskRepository.save(newTask);
        }),
      );
    } else {
      await this.taskRepository.save({
        ...task,
        ...data,
        day: givenDate.format('dddd'),
        week: Math.ceil(givenDate.date() / 7),
      });
    }

    return { success: true };
  }

  async deleteTask(id: number, userId: number) {
    return await this.taskRepository.delete({ id, userId });
  }

  getByDate(startDate: string, endDate: string, userId: number) {
    return this.taskRepository
      .createQueryBuilder('task')
      .where('task.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('task.userId = :userId', { userId })
      .orderBy('task.time', 'DESC', 'NULLS LAST')
      .getMany();
  }

  deleteTaskByDate(startDate: string, endDate: string, userId: number) {
    return this.taskRepository.delete({
      date: Between(new Date(startDate), new Date(endDate)), // ← تبدیل به Date
      userId,
    });
  }

  async getMonthlyTaskStats(userId: number) {
    const tasks = await this.taskRepository.find({ where: { userId } });

    const monthNames = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];

    const result: Record<string, any> = {};

    for (const task of tasks) {
      const year = new Date(task.date).getFullYear().toString();
      const month = monthNames[new Date(task.date).getMonth()];

      if (!result[year]) {
        result[year] = {};
        monthNames.forEach((m) => {
          result[year][m] = { done: 0, undone: 0 };
        });
      }

      if (task.done) result[year][month].done += 1;
      else result[year][month].undone += 1;
    }

    return Object.entries(result).map(([year, data]) => ({ year, data }));
  }

  async getTaskStats(userId: number): Promise<any> {
    const tasks = await this.taskRepository.find({ where: { userId } });

    const monthNames = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ];

    const weekDays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    const result: Record<string, any> = {};

    for (const task of tasks) {
      const dateObj = moment(task.date);
      if (!dateObj.isValid()) continue; // فیلتر تاریخ نامعتبر

      const year = dateObj.year().toString();
      const monthKey = monthNames[dateObj.month()];
      const dayName = weekDays[dateObj.isoWeekday() - 1];
      const dailyKey = dateObj.format('YYYY-MM-DD'); // کلید منحصر به فرد

      // ایجاد سال اگر وجود نداشته باشه
      if (!result[year]) {
        result[year] = {
          monthly: {},
          weekly: {},
          daily: {},
        };

        // مقداردهی اولیه monthly
        monthNames.forEach((m) => {
          result[year].monthly[m] = { done: 0, undone: 0 };
        });

        // مقداردهی اولیه weekly
        weekDays.forEach((d) => {
          result[year].weekly[d] = { done: 0, undone: 0 };
        });

        // daily نیازی به پیش‌مقداردهی نداره — فقط تسک‌ها اضافه میشن
      }

      const yearObj = result[year];

      // --- Monthly ---
      yearObj.monthly[monthKey].done += task.done ? 1 : 0;
      yearObj.monthly[monthKey].undone += task.done ? 0 : 1;

      // --- Weekly ---
      yearObj.weekly[dayName].done += task.done ? 1 : 0;
      yearObj.weekly[dayName].undone += task.done ? 0 : 1;

      // --- Daily (با کلید YYYY-MM-DD) ---
      if (!yearObj.daily[dailyKey]) {
        yearObj.daily[dailyKey] = { done: 0, undone: 0 };
      }
      yearObj.daily[dailyKey].done += task.done ? 1 : 0;
      yearObj.daily[dailyKey].undone += task.done ? 0 : 1;
    }

    // تبدیل به آرایه نهایی
    return Object.entries(result).map(([year, data]) => ({
      year,
      data,
    }));
  }
}
