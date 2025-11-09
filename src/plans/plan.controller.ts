import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto, PlanSettingsDto } from './plan.dto';
import { AuthGuard } from 'src/auth/auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
  };
}

@Controller('plan')
@UseGuards(AuthGuard)
export class PlanController {
  constructor(private readonly planService: PlanService) {}
  @Get()
  getAll(@Req() req: AuthenticatedRequest) {
    const allPlans = this.planService.getAll(req.user.id);
    return allPlans;
  }

  @Patch()
  toggleDone(@Body('id') id: number, @Req() req: AuthenticatedRequest) {
    return this.planService.toggleDone(id, req.user.id);
  }

  @Put(':id')
  edit(
    @Param('id') id: number,
    @Body(new ValidationPipe()) body: CreatePlanDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.planService.editPlan(body, id, req.user.id);
  }

  @Post()
  create(
    @Body(new ValidationPipe()) body: CreatePlanDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.planService.createPlan(body, req.user.id);
  }
  @Delete()
  delete(@Body('id') id: number, @Req() req: AuthenticatedRequest) {
    return this.planService.deletePlan(id, req.user.id);
  }

  @Get('/overview')
  planOverview(@Req() req: AuthenticatedRequest) {
    return this.planService.planOverview(req.user.id);
  }

  @Get('/settings')
  getSettings(@Req() req: AuthenticatedRequest) {
    return this.planService.getPlanSettings(req.user.id);
  }
  @Patch('/settings')
  editSettings(
    @Body() data: PlanSettingsDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.planService.updatePlanSettings(data, req.user.id);
  }
}
