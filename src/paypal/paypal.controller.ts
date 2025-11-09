import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { AuthGuard } from 'src/auth/auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
  };
}

@Controller('paypal')
@UseGuards(AuthGuard)
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Get('order')
  async order(@Req() req: AuthenticatedRequest) {
    return this.paypalService.createOrder(req.user.id);
  }

  @Post('finalize-order')
  async finalizeOrder(
    @Body('token') token: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.paypalService.finalizeOrder(token, req.user.id);
  }

  @Get('chart')
  async getMonthlyChart() {
    return this.paypalService.salesByMonthAllYears();
  }
}
