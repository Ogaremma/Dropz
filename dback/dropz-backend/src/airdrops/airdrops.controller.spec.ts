import { Test, TestingModule } from '@nestjs/testing';
import { AirdropsController } from './airdrops.controller';

describe('AirdropsController', () => {
  let controller: AirdropsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirdropsController],
    }).compile();

    controller = module.get<AirdropsController>(AirdropsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
