import { Module } from '@nestjs/common';
import { PaypalController } from './paypal.controller';
import { PaypalService } from './paypal.service';
import { User } from 'src/users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { Payments } from './entities/paypal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Payments, User])],
  controllers: [PaypalController],
  providers: [PaypalService],
})
export class PaypalModule {}
