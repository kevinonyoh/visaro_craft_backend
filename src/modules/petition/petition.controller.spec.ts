import { Test, TestingModule } from '@nestjs/testing';
import { PetitionController } from './petition.controller';
import { PetitionService } from './petition.service';

describe('PetitionController', () => {
  let controller: PetitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetitionController],
      providers: [PetitionService],
    }).compile();

    controller = module.get<PetitionController>(PetitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
