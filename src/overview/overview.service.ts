import { Injectable } from '@nestjs/common';
import { CreateOverviewDto } from './dto/create-overview.dto';
import { UpdateOverviewDto } from './dto/update-overview.dto';
import { Entity, Not, Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';

@Injectable()
export class OverviewService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async findAll() {
    const numberOfUsers = await this.userRepository.count({
      where: { role: 'user' },
    });
    const lastThreeUser = await this.userRepository.find({
      where: { role: 'user' },
      take: 3,
    });
    return { numberOfUsers, lastThreeUser };
  }
}
