import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTermsDto } from './dto/create-terms.dto';
import { QueryTermsDto } from './dto/query-terms.dto';
import { UpdateTermsDto } from './dto/update-terms.dto';
import { TermsContent } from './entities/terms.entity';

@Injectable()
export class TermsService {
  constructor(
    @InjectRepository(TermsContent)
    private readonly repo: Repository<TermsContent>,
  ) {}

  async upsertByLanguage(dto: CreateTermsDto) {
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

  async create(dto: CreateTermsDto) {
    return this.upsertByLanguage(dto);
  }

  async findAll(q: QueryTermsDto) {
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
    if (!item) throw new NotFoundException('Terms content not found');
    return item;
  }

  async update(id: number, dto: UpdateTermsDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException('Terms content not found');
  }
}
