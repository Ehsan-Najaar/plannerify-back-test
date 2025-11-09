import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { EmailCode } from './emailCode.entity';
import { AuthGuard } from 'src/auth/auth.guard';

interface AuthenticatedRequest extends Request {
  user: any;
}

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/getCodeForEmail')
  async createEmailCodePair(@Req() req: Request): Promise<EmailCode> {
    let { email, mobile } = req.body;
    const result = await this.usersService.createEmailCodePair(email, mobile);
    return result;
  }

  @Post()
  async createUser(@Req() req: Request): Promise<User> {
    let { firstName, lastName, email, password, code } = req.body;

    password = bcrypt.hashSync(password, 10);

    const result = await this.usersService.create({
      firstName,
      lastName,
      email,
      password,
      code,
      role: 'user',
    });

    return result;
  }

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }
  @Post('make-admin')
  async makeAdmin(@Body('id') id: number) {
    return this.usersService.makeAdmin(id);
  }

  @Post('set-plan')
  async setPlan(@Body('id') id: number, @Body('plan') plan: string) {
    return this.usersService.setPlan(id, plan);
  }
  @Delete()
  @UseGuards(AuthGuard)
  async deleteUser(@Req() req: AuthenticatedRequest, @Body('id') id: number) {
    return this.usersService.deleteUser(req.user.role, id);
  }
}
