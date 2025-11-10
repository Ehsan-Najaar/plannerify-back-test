// src/auth/auth.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { passwordRecoveryEmail } from 'src/emails';
import { User } from 'src/users/user.entity';
import { getRandom, sendEmail } from 'src/utils';
import { MoreThan, Repository } from 'typeorm';
import { PasswordRecovery } from './auth.passwordRecovery.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectRepository(PasswordRecovery)
    private recoveryRepository: Repository<PasswordRecovery>,
  ) {}

  // لاگین با access_token و refresh_token
  async signIn(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email.trim() },
    });

    if (!user) throw new UnauthorizedException();
    if (user.plan === 'banned') {
      throw new HttpException(
        { message: 'user is banned.' },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (!bcrypt.compareSync(password.trim(), user.password)) {
      throw new UnauthorizedException({ message: 'Invalid Credentials' });
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    delete user.password;

    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      }),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  // تأیید refresh_token
  async verifyRefreshToken(token: string) {
    return this.jwtService.verify(token);
  }

  // در AuthService
  async generateAccessToken(payload: any) {
    return this.jwtService.signAsync(payload, { expiresIn: '15m' });
  }

  // بازیابی رمز عبور
  async passwordRecovery({
    email,
    code,
    password,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    language,
  }: {
    email: string;
    code?: string;
    password?: string;
    language?: string;
  }) {
    if (code) {
      const valid = await this.recoveryRepository.findOne({
        where: {
          email: email.trim(),
          code: code.trim(),
          time: MoreThan(new Date(Date.now() - 3 * 60000)),
        },
      });

      if (!valid) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'CODE' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.usersRepository.findOne({
        where: { email: email.trim() },
      });

      const passwordBcrypted = bcrypt.hashSync(password, 10);
      await this.usersRepository.save({
        id: user.id,
        password: passwordBcrypted,
      });

      return { message: 'DONE' };
    } else {
      const user = await this.usersRepository.findOne({
        where: { email: email.trim() },
      });

      if (!user) {
        throw new HttpException(
          { status: HttpStatus.NOT_FOUND, error: 'EMAIL' },
          HttpStatus.NOT_FOUND,
        );
      }

      const newCode = getRandom(1000, 9999);
      await sendEmail(
        email.trim(),
        'Password Recovery',
        passwordRecoveryEmail(newCode),
      ).catch(() => {
        throw new HttpException(
          { status: HttpStatus.FAILED_DEPENDENCY, error: 'EMAIL' },
          HttpStatus.CONFLICT,
        );
      });

      const recovery = await this.recoveryRepository.save({
        code: newCode + '',
        email: email.trim(),
      });

      return { ...recovery, code: null };
    }
  }

  // اطلاعات کاربر
  async getMe(user: any) {
    const userNewCondition = await this.usersRepository.findOne({
      where: { id: user.sub },
    });
    return { plan: userNewCondition.plan, planExp: userNewCondition.planExp };
  }
}
