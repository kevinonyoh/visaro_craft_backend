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

@Module({
  imports: [ConfigsModule, DatabaseModule, JwtModule, EmailModule, CacheStoreModule, UsersModule, AuthModule, PaymentModule,],
  controllers: [AppController],
  providers: [AppService, ...appProvider],
})
export class AppModule {}
