import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './adapter/helper/extensions/string.extension';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
