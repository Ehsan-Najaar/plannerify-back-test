import { Test, TestingModule } from '@nestjs/testing';
import { SocialsController } from 'src/social/social.controller';
import { SocialService } from './social.service';

describe('SocialController', () => {
  let controller: SocialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialsController],
      providers: [SocialService],
    }).compile();

    controller = module.get<SocialsController>(SocialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
