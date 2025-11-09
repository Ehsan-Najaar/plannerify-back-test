import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { getAccessToken } from 'src/utils';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}
  async create(createSubscriptionDto: CreateSubscriptionDto) {
    await this.subscriptionRepository
      .createQueryBuilder()
      .delete()
      .from(Subscription)
      .execute();

    const result = await this.subscriptionRepository
      .createQueryBuilder()
      .insert()
      .into(Subscription)
      .values({
        bronzeTitle: createSubscriptionDto.bronzeTitle,
        bronzeDescription: createSubscriptionDto.bronzeDescription,
        bronzePrice: createSubscriptionDto.bronzePrice,
        bronzeOptions: JSON.stringify(createSubscriptionDto.bronzeOptions),

        silverTitle: createSubscriptionDto.silverTitle,
        silverDescription: createSubscriptionDto.silverDescription,
        silverPrice: createSubscriptionDto.silverPrice,
        silverOptions: JSON.stringify(createSubscriptionDto.silverOptions),

        goldTitle: createSubscriptionDto.goldTitle,
        goldDescription: createSubscriptionDto.goldDescription,
        goldPrice: createSubscriptionDto.goldPrice,
        goldOptions: JSON.stringify(createSubscriptionDto.goldOptions),
      })
      .returning('*')
      .execute();

    return result.raw;
  }

  findAll() {
    return this.subscriptionRepository.find();
  }
  async getPaypalSubscription() {
    try {
      const accessToken = await getAccessToken();
      const { PAYPAL_API } = process.env;

      const response = await axios.get(`${PAYPAL_API}/v1/billing/plans`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (err) {
      console.error('Error fetching plans:', err.message);
      return new HttpException(
        { message: err },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
