import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
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

    // ذخیره JWT در HttpOnly Cookie
    res.cookie('jwt', r.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 روز
    });
    // console.log('JWT Cookie set:', res.getHeader('Set-Cookie'));
    // فرانت فقط اطلاعات کاربر بدون توکن دریافت کند
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { access_token, ...user } = r;
    return user;
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
    // console.log('Cookies received:', req.cookies);
    return { user: req.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logged out successfully' };
  }
}
