import { HttpModule, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExampleHttpService } from './example-http.service';

describe('NewsService', () => {
  let service: ExampleHttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ExampleHttpService, Logger],
    }).compile();

    service = module.get<ExampleHttpService>(ExampleHttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
