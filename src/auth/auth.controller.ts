/* eslint-disable @typescript-eslint/no-unused-vars */
// src/auth/auth.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

interface AuthenticatedRequest extends Request {
  user: any;
  cookies: Record<string, string>;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, string>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const r = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    // refresh_token
    res.cookie('refresh_token', r.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      partitioned: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // jwt هم ست کن (برای میدلور)
    res.cookie('jwt', r.access_token, {
      httpOnly: false, // میدلور باید بتونه بخونه
      secure: true,
      sameSite: 'none',
      partitioned: true,
      maxAge: 15 * 60 * 1000, // 15 دقیقه
    });

    const { refresh_token, ...response } = r;
    return response;
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) throw new UnauthorizedException();

    try {
      const payload = await this.authService.verifyRefreshToken(refreshToken);
      const newAccessToken = await this.authService.generateAccessToken({
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      });

      // آپدیت کوکی jwt
      res.cookie('jwt', newAccessToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        partitioned: true,
        maxAge: 15 * 60 * 1000, // 15 دقیقه
      });

      return { access_token: newAccessToken };
    } catch (error) {
      // پاک کردن هر دو کوکی با تنظیمات کامل
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        partitioned: true,
      });
      res.clearCookie('jwt', {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        partitioned: true,
      });

      throw new UnauthorizedException();
    }
  }

  @Post('password-recovery')
  async passwordRecovery(
    @Body()
    body: {
      email: string;
      code?: string;
      password?: string;
      language?: string;
    },
  ) {
    return await this.authService.passwordRecovery(body);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.authService.getMe(req.user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      partitioned: true,
    });
    res.clearCookie('jwt', {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      partitioned: true,
    });
    return { message: 'Logged out successfully' };
  }
}
