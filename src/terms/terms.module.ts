import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermsController } from './terms.controller';
import { TermsService } from './terms.service';
import { TermsContent } from './entities/terms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TermsContent])],
  controllers: [TermsController],
  providers: [TermsService],
  exports: [TermsService],
})
export class TemrsModule {}
