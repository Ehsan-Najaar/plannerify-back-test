// src/socials/socials.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Social } from './entities/social.entity';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { QuerySocialDto } from './dto/query-social.dto';

@Injectable()
export class SocialsService {
  constructor(
    @InjectRepository(Social)
    private readonly repo: Repository<Social>,
  ) {}

  async create(dto: CreateSocialDto): Promise<Social> {
    // (Optional) basic sanity check for base64
    if (!/^([A-Za-z0-9+/=\s]|data:.*;base64,)+$/.test(dto.logoBase64)) {
      // allow data URI or raw base64; relax/tighten as needed
      // not throwing to avoid overly strict; uncomment to enforce:
      // throw new BadRequestException('Invalid base64 string');
    }
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(query: QuerySocialDto) {
    const where = query.q ? [{ name: ILike(`%${query.q}%`) }] : undefined;

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: query.offset ?? 0,
      take: query.limit ?? 20,
    });

    return {
      total,
      offset: query.offset ?? 0,
      limit: query.limit ?? 20,
      items,
    };
  }

  async findOne(id: number): Promise<Social> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Social not found');
    return item;
  }

  async update(id: number, dto: UpdateSocialDto): Promise<Social> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException('Social not found');
  }
}
