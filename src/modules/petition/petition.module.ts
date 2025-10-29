import { Module, forwardRef } from '@nestjs/common';
import { PetitionService } from './petition.service';
import { PetitionController } from './petition.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PetitionModel } from './model/petition.model';
import { PetitionRepository } from './repositories/petition.repository';
import { DocumentsModel } from './model/document.model';
import { DocumentRepository } from './repositories/document.repository';
import { PaymentModule } from '../payment/payment.module';
import { PetitionStageModel } from './model/petition-stage.model';
import { PetitionStageRepository } from './repositories/Petition-stage.repository';
import { PetitionCronService } from './crons/petition-cron.service';
import { AuditTrailModule } from '../audit-trail/audit-trail.module';


@Module({
  imports: [SequelizeModule.forFeature([PetitionModel, DocumentsModel, PetitionStageModel]), forwardRef(() => PaymentModule), AuditTrailModule],
  controllers: [PetitionController],
  providers: [PetitionService, PetitionRepository, DocumentRepository, PetitionStageRepository, PetitionCronService],
  exports: [PetitionService]
})
export class PetitionModule {}
