import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeService } from './payment-factory/integration/stripe.service';
import { PaymentOptionsRepository } from './repositories/payment-option.repository';
import { PaymentOptionsModel } from './models/payment-option.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentModel } from './models/payment.model';

@Module({
  imports: [SequelizeModule.forFeature([PaymentOptionsModel, PaymentModel]), UsersModule],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService, PaymentOptionsRepository, PaymentRepository],
  exports: [PaymentService]
})
export class PaymentModule {}
