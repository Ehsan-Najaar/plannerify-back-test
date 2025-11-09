import { Injectable, Request } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}
  create(createReportDto: CreateReportDto, userId: number) {
    return this.reportRepository.save({
      ...createReportDto,
      answer: '',
      userId,
    });
  }

  findAll(userId: number) {
    return this.reportRepository.find({
      where: { userId },
      order: { id: 'DESC' },
      relations: ['user'],
    });
  }

  adminFindAll() {
    return this.reportRepository
      .createQueryBuilder('report')
      .leftJoin('report.user', 'user')
      .addSelect(['user.firstName', 'user.lastName', 'user.email'])
      .orderBy('report.id', 'DESC')
      .getMany();
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const report = await this.reportRepository.findOne({
      where: {
        id,
      },
    });
    report.answer = updateReportDto.answer;
    this.reportRepository.save(report);
  }
}
