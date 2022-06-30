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
import { AmqplibModule } from '@ccmos/nestjs-amqplib';
import { SenderMessageService } from '../domain/service/amqp/sender-message.service';

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
    AmqplibModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        url: config.get<string>('microservices.rabbitmq.url')
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
    SenderMessageService
  ],
  exports: [SeedNeighborhoodsByCityService]
})
export class SeedModule {}