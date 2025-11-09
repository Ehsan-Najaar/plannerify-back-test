import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { DataSource } from 'typeorm';
import { Payments } from './entities/paypal.entity';
import { User } from 'src/users/user.entity';
import * as moment from 'moment';

@Injectable()
export class PaypalService {
  constructor(private readonly dataSource: DataSource) {}
  private clientId = process.env.PAYPAL_CLIENT_ID;
  private secret = process.env.PAYPAL_SECRET;
  private baseUrl = process.env.PAYPAL_API;

  private async getAccessToken(): Promise<string> {
    const tokenUrl = `${this.baseUrl}/v1/oauth2/token`;

    const auth = Buffer.from(`${this.clientId}:${this.secret}`).toString(
      'base64',
    );

    try {
      const response = await axios.post(
        tokenUrl,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      return response.data.access_token;
    } catch (error) {
      throw new HttpException(
        'Failed to get access token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async createOrder(userId: number) {
    const sub = await this.dataSource.getRepository(Subscription).find();
    const price = sub?.[0].silverPrice;

    const token = await this.getAccessToken();

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: String(price),
          },
          custom_id: userId,
        },
      ],
      application_context: {
        return_url: process.env.PAYPAL_SUCCESS_URL,
        cancel_url: process.env.PAYPAL_FAIL_URL,
      },
    };

    const res = await axios.post(
      `${this.baseUrl}/v2/checkout/orders`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.data as {
      id: string;
      links: { rel: string; href: string; method: string }[];
    };
  }

  async finalizeOrder(token: string, userId: number) {
    const accessToken = await this.getAccessToken();

    try {
      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders/${token}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data.status === 'COMPLETED') {
        await this.dataSource.getRepository(Payments).save({
          userId,
          amount:
            response.data.purchase_units[0].payments.captures[0].amount.value,
          orderId: response.data.id,
        });
        await this.dataSource
          .getRepository(User)
          .update(
            { id: userId },
            { plan: 'premium', planExp: moment().add(1, 'month').toDate() },
          );
      }
      return { message: 'Order captured successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to capture order',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async salesByMonthAllYears() {
    const repo = this.dataSource.getRepository(Payments);
    const rows = await repo
      .createQueryBuilder('p')
      .select('EXTRACT(YEAR FROM p.applyDate)', 'year')
      .addSelect('EXTRACT(MONTH FROM p.applyDate)', 'month')
      .addSelect('COUNT(*)', 'sales')
      .addSelect('SUM((p.amount)::numeric)', 'total_usd') // amount رشته است، به numeric کست می‌کنیم
      .groupBy('year')
      .addGroupBy('month')
      .orderBy('year', 'ASC')
      .addOrderBy('month', 'ASC')
      .getRawMany<{
        year: string;
        month: string;
        sales: string;
        total_usd: string;
      }>();

    return rows.map((r) => ({
      month: monthLabel(+r.year, +r.month),
      sales: Number(r.sales),
      totalUSD: Number(r.total_usd),
      year: Number(r.year),
      monthIndex: Number(r.month),
    }));
  }
}

function monthLabel(year: number, month1to12: number) {
  const abbr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][month1to12 - 1];
  return `${abbr} ${year}`;
}
