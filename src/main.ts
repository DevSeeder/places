import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get<ConfigService>(ConfigService);

  buildSwagger(app, configService);

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://user:bitnami@localhost:5672/places`],
      queue: 'seed-places',
      queueOptions: {
        durable: true
      }
    }
  });

  app.startAllMicroservices();

  return await app.listen(configService.get<string>('api.port'));
}

async function buildSwagger(
  app: INestApplication,
  configService: ConfigService
) {
  const docApi = new DocumentBuilder()
    .setTitle('Places')
    .setDescription('Places API')
    .setVersion(configService.get<string>('doc.version'))
    .build();

  const document = SwaggerModule.createDocument(app, docApi);
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('api', app, document);
}

module.exports = bootstrap();
