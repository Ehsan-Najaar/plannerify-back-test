// src/about/about.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AboutContent } from './entities/about.entity';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';
import { QueryAboutDto } from './dto/query-about.dto';

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(AboutContent)
    private readonly repo: Repository<AboutContent>,
  ) {}

  async upsertByLanguage(dto: CreateAboutDto) {
    // اگر رکوردی برای languageId هست، آپدیت؛ وگرنه ایجاد
    const existing = await this.repo.findOne({
      where: { languageId: dto.languageId },
    });
    if (existing) {
      existing.contentHtml = dto.contentHtml;
      return this.repo.save(existing);
    }
    const created = this.repo.create(dto);
    return this.repo.save(created);
  }

  async create(dto: CreateAboutDto) {
    return this.upsertByLanguage(dto);
  }

  async findAll(q: QueryAboutDto) {
    const where = q.languageId ? { languageId: q.languageId } : {};
    const [items, total] = await this.repo.findAndCount({
      where,
      order: { updatedAt: 'DESC' },
      skip: q.offset ?? 0,
      take: q.limit ?? 50,
      relations: ['language'],
    });
    return { total, items };
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({
      where: { id },
      relations: ['language'],
    });
    if (!item) throw new NotFoundException('About content not found');
    return item;
  }

  async update(id: number, dto: UpdateAboutDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException('About content not found');
  }
}
