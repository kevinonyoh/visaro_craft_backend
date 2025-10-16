import { Module, forwardRef } from '@nestjs/common';
import { PetitionService } from './petition.service';
import { PetitionController } from './petition.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PetitionModel } from './model/petition.model';
import { PetitionRepository } from './repositories/petition.repository';
import { DocumentsModel } from './model/document.model';
import { DocumentRepository } from './repositories/document.repository';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [SequelizeModule.forFeature([PetitionModel, DocumentsModel]), forwardRef(() => PaymentModule)],
  controllers: [PetitionController],
  providers: [PetitionService, PetitionRepository, DocumentRepository],
  exports: [PetitionService]
})
export class PetitionModule {}
