import { Module } from '@nestjs/common';
import { PetitionService } from './petition.service';
import { PetitionController } from './petition.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PetitionModel } from './model/petition.model';
import { PetitionRepository } from './repositories/petition.repository';
import { PaymentModule } from '../payment/payment.module';
import { DocumentsModel } from './model/document.model';
import { DocumentRepository } from './repositories/document.repository';

@Module({
  imports: [SequelizeModule.forFeature([PetitionModel, DocumentsModel]), PaymentModule],
  controllers: [PetitionController],
  providers: [PetitionService, PetitionRepository, DocumentRepository],
})
export class PetitionModule {}
