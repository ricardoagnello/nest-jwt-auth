import { Test, TestingModule } from '@nestjs/testing';
import { InvalidTokenService } from './invalid-token.service';

describe('InvalidTokenService', () => {
  let service: InvalidTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvalidTokenService],
    }).compile();

    service = module.get<InvalidTokenService>(InvalidTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
