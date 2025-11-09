import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Idea } from './entities/idea.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IdeasService {
  constructor(
    @InjectRepository(Idea) private ideaRepository: Repository<Idea>,
  ) {}

  create(createIdeaDto: CreateIdeaDto, userId: number) {
    return this.ideaRepository.save({ ...createIdeaDto, userId });
  }

  findAll(userId: number) {
    return this.ideaRepository.find({
      where: { userId },
      order: { id: 'DESC' },
    });
  }

  async update(id: number, updateIdeaDto: UpdateIdeaDto, userId: number) {
    const goal = await this.ideaRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!goal) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    goal.title = updateIdeaDto.title;
    goal.description = updateIdeaDto.description;

    return this.ideaRepository.save(goal);
  }

  async remove(id: number, userId: number) {
    return this.ideaRepository.delete({ id, userId });
  }
}
