import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminRepository } from './repositories/admin.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModel } from './model/admin.model';
import { EmailModule } from 'src/shared/notification/email/email.module';
import { CacheStoreModule } from 'src/shared/cache-store/cache-store.module';
import { UsersModule } from '../users/users.module';
import { AgentModule } from '../agent/agent.module';
import { AuditTrailModule } from '../audit-trail/audit-trail.module';
import { PetitionModule } from '../petition/petition.module';

@Module({
  imports: [SequelizeModule.forFeature([AdminModel]), EmailModule, CacheStoreModule, UsersModule, AgentModule, AuditTrailModule, PetitionModule],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
  exports: [AdminService]
})
export class AdminModule {}
