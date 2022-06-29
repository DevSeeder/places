import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PuppeteerModule } from 'nest-puppeteer';
import { NeighborhoodsController } from './controller/neighborhoods.controller';
import { GuiaMaisRepository } from './repository/neighborhoods/puppeteer/guia-mais.repository';
import { GetNeighborhoodsByCityService } from '../domain/service/neighborhoods/get/get-neighborhoods-by-city.service';
import configuration from '../../config/configuration';
import { NeighborhoodsMongoose } from './repository/neighborhoods/neighborhoods-mongoose.repository';
import {
  Neighborhood,
  NeighborhoodSchema
} from '../domain/schemas/neighborhood.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SaveNeighborhoodsByCityService } from '../domain/service/neighborhoods/save-neighborhoods-by-city.service';
import { GetNeighborhoodsByStateService } from '../domain/service/neighborhoods/get/get-neighborhoods-by-state.service';
import { CitiesModule } from './cities.module';

@Module({
  imports: [
    PuppeteerModule.forFeature(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forFeature([
      { name: Neighborhood.name, schema: NeighborhoodSchema }
    ]),
    CitiesModule
  ],
  controllers: [NeighborhoodsController],
  providers: [
    {
      provide: 'GuiaMaisRepository',
      useClass: GuiaMaisRepository
    },
    NeighborhoodsMongoose,
    GetNeighborhoodsByCityService,
    GetNeighborhoodsByStateService,
    SaveNeighborhoodsByCityService
  ],
  exports: [
    NeighborhoodsMongoose,
    GetNeighborhoodsByCityService,
    GetNeighborhoodsByStateService
  ]
})
export class NeighborhoodsModule {}
