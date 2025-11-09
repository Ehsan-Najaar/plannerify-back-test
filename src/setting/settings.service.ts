import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './settings.entity';
import { UpdateSettingsDto } from './update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepo: Repository<Settings>,
  ) {}

  // برگرداندن یا ایجاد تنظیمات پیش‌فرض
  async getSettings() {
    let settings = await this.settingsRepo.findOne({ where: {} });
    if (!settings) {
      settings = this.settingsRepo.create({});
      return this.settingsRepo.save(settings);
    }
    return settings;
  }

  // مخصوص فرانت‌اند: فقط لوگو و نام سایت
  async getSiteInfo() {
    const settings = await this.getSettings();
    return {
      logoBase64: settings.logoBase64 || null,
      siteName: settings.siteName || 'My Website',
    };
  }

  // آپدیت تنظیمات
  async updateSettings(data: UpdateSettingsDto) {
    const settings = await this.getSettings();
    Object.assign(settings, data);
    return this.settingsRepo.save(settings);
  }
}
