import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModel } from './models/users.model';
import { UsersRepository } from './repositories/users.repository';
import { EmailModule } from 'src/shared/notification/email/email.module';
import { CacheStoreModule } from 'src/shared/cache-store/cache-store.module';
import { AgentModule } from '../agent/agent.module';
import { AuditTrailModule } from '../audit-trail/audit-trail.module';

@Module({
  imports: [SequelizeModule.forFeature([UsersModel]), EmailModule, CacheStoreModule,  forwardRef(() => AgentModule), AuditTrailModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService]
})
export class UsersModule {}
