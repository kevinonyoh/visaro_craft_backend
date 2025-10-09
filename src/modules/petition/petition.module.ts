import { Module } from '@nestjs/common';
import { PetitionService } from './petition.service';
import { PetitionController } from './petition.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PetitionModel } from './model/petition.model';
import { PetitionRepository } from './repositories/petition.repository';

@Module({
  imports: [SequelizeModule.forFeature([PetitionModel])],
  controllers: [PetitionController],
  providers: [PetitionService, PetitionRepository],
})
export class PetitionModule {}
