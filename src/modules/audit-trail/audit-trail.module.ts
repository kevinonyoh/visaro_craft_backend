import { Module } from '@nestjs/common';
import { AuditTrailService } from './audit-trail.service';
import { AuditTrailController } from './audit-trail.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ActivitiesModel } from './model/audit-trail.model';
import { ActivitiesRepository } from './repositories/audit-trail.repository';
import { NotificationModel } from './model/notification.model';
import { NotificationRepository } from './repositories/notification.repository';

@Module({
  imports: [SequelizeModule.forFeature([ActivitiesModel, NotificationModel])],
  controllers: [AuditTrailController],
  providers: [AuditTrailService, ActivitiesRepository, NotificationRepository],
  exports: [AuditTrailService]
})
export class AuditTrailModule {}
