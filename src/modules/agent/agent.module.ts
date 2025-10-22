import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AgentsModel } from './model/agent.model';
import { EmailModule } from 'src/shared/notification/email/email.module';
import { CacheStoreModule } from 'src/shared/cache-store/cache-store.module';
import { AgentsRepository } from './repositories/agent.repository';
import { AgentRewardsModel } from './model/agent-reward.model';
import { AgentRewardRepository } from './repositories/agent-reward.repository';

@Module({
  imports: [SequelizeModule.forFeature([AgentsModel, AgentRewardsModel]), EmailModule, CacheStoreModule],
  controllers: [AgentController],
  providers: [AgentService, AgentsRepository, AgentRewardRepository],
  exports: [AgentService]
})
export class AgentModule {}
