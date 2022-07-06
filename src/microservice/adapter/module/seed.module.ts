import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedNeighborhoodsByStateService } from '../../domain/service/seed/seed-neighborhoods-by-state.service';
import { LogSeed, LogSeedSchema } from '../../domain/schemas/logseed.schema';
import { LogSeedMongoose } from '../repository/logseed/logseed-mongoose.repository';
import { LogSeedJobService } from '../../domain/service/logseed/log-seed-job.service';
import { SeedController } from '../controller/seed.controller';
import { NeighborhoodsModule } from './neighborhoods.module';
import { CitiesModule } from './cities.module';
import { SeedNeighborhoodsByCityService } from '../../domain/service/seed/seed-neighborhoods-by-city.service';
import { PuppeteerModule } from 'nest-puppeteer';
import { GuiaMaisRepository } from '../repository/neighborhoods/puppeteer/guia-mais.repository';
import { AMQPModule } from './amqp.module';
import { GetNeighborhoodsByCityService } from 'src/microservice/domain/service/neighborhoods/get/get-neighborhoods-by-city.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    PuppeteerModule.forFeature(),
    MongooseModule.forFeature([{ name: LogSeed.name, schema: LogSeedSchema }]),
    CitiesModule,
    AMQPModule,
    forwardRef(() => NeighborhoodsModule)
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
    LogSeedJobService
  ],
  exports: [SeedNeighborhoodsByCityService]
})
export class SeedModule {}
