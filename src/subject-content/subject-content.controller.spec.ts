import { Test, TestingModule } from '@nestjs/testing';
import { SubjectContentController } from './subject-content.controller';
import { SubjectContentService } from './subject-content.service';

describe('SubjectContentController', () => {
  let controller: SubjectContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectContentController],
      providers: [SubjectContentService],
    }).compile();

    controller = module.get<SubjectContentController>(SubjectContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
