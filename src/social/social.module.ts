import { Module } from '@nestjs/common';
import { SocialsController } from './social.controller';
import { SocialsService } from './social.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Social } from './entities/social.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Social])],

  controllers: [SocialsController],
  providers: [SocialsService],
})
export class SocialModule {}
