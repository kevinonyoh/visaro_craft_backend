import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { loggerMiddleware } from './common/middleware/logger.middleware';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as https from 'https';

dotenv.config();

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {cors: true});


  const port = process.env.PORT || 5003;

  app.enableCors({
    origin: [
      'https://visarocraft.com',      
      'https://web.postman.co',      
      'https://postman.com',          
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.setGlobalPrefix('/api/v1');

  app.use('/api/v1/payment/webhook', bodyParser.raw({ type: 'application/json' }));
  
  app.use(compression());

  app.use(loggerMiddleware);

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port, '0.0.0.0', () => console.log(`App running on port ${port}`));

}
bootstrap();
