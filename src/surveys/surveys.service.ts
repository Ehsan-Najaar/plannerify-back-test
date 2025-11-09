import { Injectable, Request } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SurveysService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
  ) {}
  create(createSurveyDto: CreateSurveyDto, userId: number) {
    return this.surveyRepository.save({
      ...createSurveyDto,
      answer: '',
      userId,
    });
  }

  findAll(userId: number) {
    return this.surveyRepository.find({
      where: { userId },
      order: { id: 'DESC' },
      relations: ['user'],
    });
  }

  adminFindAll() {
    return this.surveyRepository
      .createQueryBuilder('survey')
      .leftJoin('survey.user', 'user')
      .addSelect(['user.firstName', 'user.lastName', 'user.email'])
      .orderBy('survey.priority', 'DESC')
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} survey`;
  }

  async update(id: number, updateSurveyDto: UpdateSurveyDto) {
    const survey = await this.surveyRepository.findOne({
      where: {
        id,
      },
    });
    survey.answer = updateSurveyDto.answer;
    this.surveyRepository.save(survey);
  }

  remove(id: number) {
    return `This action removes a #${id} survey`;
  }
}
