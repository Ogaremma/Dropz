import { Test, TestingModule } from '@nestjs/testing';
import { AirdropsService } from './airdrops.service';

describe('AirdropsService', () => {
  let service: AirdropsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirdropsService],
    }).compile();

    service = module.get<AirdropsService>(AirdropsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
