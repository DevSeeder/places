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
import { Country, CountrySchema } from '../domain/schemas/country.schema';
import { ValidateCountryByNameOrAliasService } from '../domain/service/countries/validate-country-by-name-or-alias.service';
import { CountriesMongoose } from './repository/countries/countries-mongoose.repository';
import { State, StateSchema } from '../domain/schemas/state.schema';
import { ValidateStateByNameOrAliasService } from '../domain/service/states/validate-state-by-name-or-alias.service';
import { StatesMongoose } from './repository/states/states-mongoose.repository';
import { City, CitySchema } from '../domain/schemas/city.schema';
import { ValidateCityByNameOrAliasService } from '../domain/service/cities/validate-city-by-name-or-alias.service';
import { CitiesMongoose } from './repository/cities/cities-mongoose.repository';
import { GetNeighborhoodsByStateService } from '../domain/service/neighborhoods/get/get-neighborhoods-by-state.service';
import { ValidateInputParamsService } from '../domain/service/validate/validate-input-params.service';
import { SeedNeighborhoodsByStateService } from '../domain/service/neighborhoods/seed/seed-neighborhoods-by-state.service';
import { GetCitiesByStateService } from '../domain/service/cities/get/get-cities-by-state.service';
import { LogSeed, LogSeedSchema } from '../domain/schemas/logseed.schema';
import { LogSeedMongoose } from './repository/logseed/logseed-mongoose.repository';
import { LogSeedJobService } from '../domain/service/logseed/log-seed-job.service';

@Module({
  imports: [
    PuppeteerModule.forFeature(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forFeature([
      { name: Neighborhood.name, schema: NeighborhoodSchema },
      { name: Country.name, schema: CountrySchema },
      { name: State.name, schema: StateSchema },
      { name: City.name, schema: CitySchema },
      { name: LogSeed.name, schema: LogSeedSchema }
    ])
  ],
  controllers: [NeighborhoodsController],
  providers: [
    {
      provide: 'GuiaMaisRepository',
      useClass: GuiaMaisRepository
    },
    NeighborhoodsMongoose,
    CountriesMongoose,
    StatesMongoose,
    CitiesMongoose,
    LogSeedMongoose,
    GetNeighborhoodsByCityService,
    GetNeighborhoodsByStateService,
    SaveNeighborhoodsByCityService,
    ValidateCountryByNameOrAliasService,
    ValidateStateByNameOrAliasService,
    ValidateCityByNameOrAliasService,
    ValidateInputParamsService,
    SeedNeighborhoodsByStateService,
    LogSeedJobService,
    GetCitiesByStateService
  ]
})
export class NeighborhoodsModule {}
