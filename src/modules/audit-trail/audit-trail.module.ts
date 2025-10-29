import { Module } from '@nestjs/common';
import { AuditTrailService } from './audit-trail.service';
import { AuditTrailController } from './audit-trail.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ActivitiesModel } from './model/audit-trail.model';
import { ActivitiesRepository } from './repositories/audit-trail.repository';

@Module({
  imports: [SequelizeModule.forFeature([ActivitiesModel])],
  controllers: [AuditTrailController],
  providers: [AuditTrailService, ActivitiesRepository],
  exports: [AuditTrailService]
})
export class AuditTrailModule {}
