import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {}

  async create(createLanguageDto: CreateLanguageDto) {
    const language = await this.languageRepository.findOneBy({
      languageCode: createLanguageDto.languageCode,
    });

    if (language) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'DUPLICATE',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.languageRepository.save(createLanguageDto);
    return { status: 'OK' };
  }

  findAll() {
    return this.languageRepository.find();
  }

  async findOne(languageCode: string) {
    return (await this.languageRepository.findOneBy({ languageCode })) || {};
  }

  remove(languageCode: string) {
    return this.languageRepository.delete({ languageCode });
  }
}
