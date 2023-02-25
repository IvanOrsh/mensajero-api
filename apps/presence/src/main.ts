import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { PresenceModule } from './presence.module';
import { SharedService } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(PresenceModule);

  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const queue = configService.get('RABBITMQ_PRESENCE_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(queue));

  app.startAllMicroservices();
}
bootstrap();
