import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './update-settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // برای فرانت: همه کاربران
  @Get('site-info')
  async getSiteInfo() {
    return this.settingsService.getSiteInfo();
  }

  // برای ادمین: آپدیت لوگو و siteName
  @UseGuards(AuthGuard)
  @Put('logo')
  async updateLogo(@Body() body: UpdateSettingsDto, @Req() req: any) {
    if (req.user?.role !== 'admin' && req.user?.role !== 'super-admin') {
      return { status: 403, message: 'Forbidden' };
    }
    return this.settingsService.updateSettings(body);
  }
}
