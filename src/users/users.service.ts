import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { EmailCode } from './emailCode.entity';
import { getRandom, sendEmail } from 'src/utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as nodemailer from 'nodemailer';
import { activationCodeEmail, welcomeUserEmail } from 'src/emails';
import * as moment from 'moment';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(EmailCode)
    private emailCodeRepository: Repository<EmailCode>,
  ) {}

  async create(data): Promise<User> {
    const codeIsCorrect = await this.emailCodeRepository
      .createQueryBuilder('this')
      .where(
        `
    this.email = :email AND 
    this.code = :code AND
    this.validUntil > :now
    `,
        {
          email: data.email.trim(),
          code: data.code.trim(),
          now: Math.floor(Date.now() / 1000),
        },
      )
      .getOne();

    if (!codeIsCorrect) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'BAD_CODE',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usersRepository.findOne({
      where: { email: data.email.trim() },
    });

    if (user) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'EMAIL',
        },
        HttpStatus.CONFLICT,
      );
    }

    const result = await this.usersRepository.save({ ...data, plan: 'free' });
    delete result.password;

    sendEmail(
      data.email,
      'Welcome to Plannerify.io',
      welcomeUserEmail(data.firstName + ' ' + data.lastName),
    );

    return result;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createEmailCodePair(email: string, language: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email.trim() },
    });

    if (user) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'EMAIL',
        },
        HttpStatus.CONFLICT,
      );
    }

    const hasValidCode = await this.emailCodeRepository
      .createQueryBuilder('this')
      .where('this.email = :email', { email: email.trim() })
      .andWhere('this.validUntil > :currentTimestamp', {
        currentTimestamp: Math.floor(Date.now() / 1000),
      })
      .getOne();

    if (hasValidCode) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'CODE',
        },
        HttpStatus.CONFLICT,
      );
    }

    const code = getRandom(100000, 999999);
    const validUntil = Math.floor(Date.now() / 1000) + 120;

    await sendEmail(email, 'Activation Code', activationCodeEmail(code)).catch(
      () => {
        throw new HttpException(
          {
            status: HttpStatus.FAILED_DEPENDENCY,
            error: 'EMAIL_SENT',
          },
          HttpStatus.CONFLICT,
        );
      },
    );

    const result = await this.emailCodeRepository.save({
      email: email.trim(),
      code,
      validUntil,
    });
    return { ...result, code: null };
  }
  async getUsers() {
    return this.usersRepository.find({
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'role',
        'plan',
        'createdAt',
      ],
      order: { id: 'DESC' },
    });
  }
  async makeAdmin(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (user.role === 'admin') {
      user.role = 'user';
    } else {
      user.role = 'admin';
    }
    await this.usersRepository.save(user);

    return { role: user.role, id: user.id };
  }

  async setPlan(id: number, plan: string) {
    const user = await this.usersRepository.findOneBy({ id });

    user.plan = plan;
    user.planExp = moment().add(1, 'month').toDate(); // Set plan expiration to 1 month from now
    if (plan === 'none') {
      user.planExp = null; // If plan is 'none', set expiration to null
    }

    await this.usersRepository.save(user);

    return { plan: user.plan, id: user.id };
  }
  async deleteUser(operatorRole: string, userId: number) {
    if (operatorRole === 'admin' || operatorRole === 'super-admin') {
      return await this.usersRepository.delete({ id: userId });
    } else {
      return new HttpException(
        { message: 'operator has no authorization for this operation' },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
