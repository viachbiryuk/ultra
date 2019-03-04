process.env.TZ = 'utc';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONF } from './conf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(CONF.API_PORT);
}
bootstrap();
