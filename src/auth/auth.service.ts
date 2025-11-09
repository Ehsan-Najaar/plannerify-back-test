// auth/auth.service.ts

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/user.entity';
import { getRandom, sendEmail } from 'src/utils';
import { MoreThan, Repository } from 'typeorm';
import { PasswordRecovery } from './auth.passwordRecovery.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { passwordRecoveryEmail } from 'src/emails';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectRepository(PasswordRecovery)
    private recoveryRepository: Repository<PasswordRecovery>,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email.trim() },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    if (user.plan === 'banned') {
      throw new HttpException(
        { message: 'user is banned.' },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (!email || !password) {
      throw new BadRequestException({
        message: 'Invalid credentials',
      });
    }
    if (bcrypt.compareSync(password.trim(), user.password)) {
      delete user.password;
      return {
        ...user,
        access_token: await this.jwtService.signAsync({ ...user }),
      };
    } else {
      throw new UnauthorizedException({
        message: 'Invalid Credentials',
      });
    }
  }
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
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'CODE',
          },
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
          {
            status: HttpStatus.NOT_FOUND,
            error: 'EMAIL',
          },
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
          {
            status: HttpStatus.FAILED_DEPENDENCY,
            error: 'EMAIL',
          },
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
  async getMe(user: any) {
    const userNewCondition = await this.usersRepository.findOne({
      where: { id: user.id },
    });
    return { plan: userNewCondition.plan, planExp: userNewCondition.planExp };
  }
}
