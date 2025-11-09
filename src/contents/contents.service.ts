import { Injectable } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content) private contentRepository: Repository<Content>,
  ) {}

  async create(createContentDto: CreateContentDto, files: any) {
    // ✅ دیگر delete نکنیم: فقط upsert
    const kv = new Map<string, string>();

    // 1) از DTO پر کن و دِدیوپ کن
    for (const pair of createContentDto?.data ?? []) {
      if (!pair?.key) continue;
      kv.set(String(pair.key), pair.value != null ? String(pair.value) : '');
    }

    // 2) فایل‌ها را روی همان key‌ها بنشان
    const setFile = (field: string) => {
      const f = files?.[field]?.[0];
      if (f?.filename) kv.set(field, f.filename);
    };

    setFile('videoFile');
    setFile('featureImage_1');
    setFile('featureImage_2');
    setFile('featureImage_3');
    setFile('featureImage_4');
    setFile('featureImage_5');
    setFile('featureImage_6');

    // 3) به آرایهٔ upsert تبدیل کن
    const rows = Array.from(kv.entries()).map(([key, value]) => ({
      key,
      value,
    }));

    if (rows.length === 0) {
      return { message: 'nothing-to-upsert' };
    }

    // 4) upsert براساس key
    // TypeORM v0.3+: abstract برای همه‌ی درایورها
    await this.contentRepository.upsert(rows, ['key']);

    return { message: 'success', affected: rows.length };
  }

  findAll() {
    return this.contentRepository.find();
  }
}
