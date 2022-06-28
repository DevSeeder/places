import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get<ConfigService>(ConfigService);

  const docApi = new DocumentBuilder()
    .setTitle('Places')
    .setDescription('Places API')
    .setVersion(configService.get<string>('doc.version'))
    .build();

  const document = SwaggerModule.createDocument(app, docApi);
  SwaggerModule.setup('api', app, document);

  return await app.listen(configService.get<string>('api.port'));
}

module.exports = bootstrap();
