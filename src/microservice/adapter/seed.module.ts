import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedNeighborhoodsByStateService } from '../domain/service/seed/seed-neighborhoods-by-state.service';
import { LogSeed, LogSeedSchema } from '../domain/schemas/logseed.schema';
import { LogSeedMongoose } from './repository/logseed/logseed-mongoose.repository';
import { LogSeedJobService } from '../domain/service/logseed/log-seed-job.service';
import { SeedController } from './controller/seed.controller';
import { NeighborhoodsModule } from './neighborhoods.module';
import { CitiesModule } from './cities.module';
import { SeedNeighborhoodsByCityService } from '../domain/service/seed/seed-neighborhoods-by-city.service';
import { PuppeteerModule } from 'nest-puppeteer';
import { GuiaMaisRepository } from './repository/neighborhoods/puppeteer/guia-mais.repository';
import { SenderMessageService } from '../domain/service/amqp/sender-message.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    PuppeteerModule.forFeature(),
    MongooseModule.forFeature([{ name: LogSeed.name, schema: LogSeedSchema }]),
    CitiesModule,
    forwardRef(() => NeighborhoodsModule),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        exchanges: [
          {
            name: 'seed-exc',
            type: 'topic'
          }
        ],
        uri: config.get<string>('microservices.rabbitmq.url')
      })
    })
  ],
  controllers: [SeedController],
  providers: [
    {
      provide: 'GuiaMaisRepository',
      useClass: GuiaMaisRepository
    },
    LogSeedMongoose,
    SeedNeighborhoodsByStateService,
    SeedNeighborhoodsByCityService,
    LogSeedJobService,
    SenderMessageService,
    {
      provide: 'CLIENT_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('microservices.rabbitmq.url')],
            queue: configService.get<string>('microservices.rabbitmq.queue'),
            queueOptions: {
              durable: true
            }
          }
        });
      },
      inject: [ConfigService]
    }
  ],
  exports: [SeedNeighborhoodsByCityService, SenderMessageService]
})
export class SeedModule {}
