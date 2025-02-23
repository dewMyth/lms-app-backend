import { Test, TestingModule } from '@nestjs/testing';
import { SubjectContentService } from './subject-content.service';

describe('SubjectContentService', () => {
  let service: SubjectContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectContentService],
    }).compile();

    service = module.get<SubjectContentService>(SubjectContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
