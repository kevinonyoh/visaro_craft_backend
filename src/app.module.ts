import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigsModule } from './common/configs/configs.module';
import { DatabaseModule } from './shared/database/database.module';
import { appProvider } from './common/app.provider';
import { JwtModule } from '@nestjs/jwt';
import { CacheStoreModule } from './shared/cache-store/cache-store.module';
import { EmailModule } from './shared/notification/email/email.module';
import { AuthModule } from './modules/auth/auth.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PetitionModule } from './modules/petition/petition.module';
import { AgentModule } from './modules/agent/agent.module';
import { AdminModule } from './modules/admin/admin.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuditTrailModule } from './modules/audit-trail/audit-trail.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [ConfigsModule, DatabaseModule, JwtModule, EmailModule, CacheStoreModule, ScheduleModule.forRoot(), UsersModule, AuthModule, PaymentModule, PetitionModule, AgentModule, AdminModule, AuditTrailModule, ChatModule,],
  controllers: [AppController],
  providers: [AppService, ...appProvider],
})
export class AppModule {}
