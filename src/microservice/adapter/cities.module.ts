import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from '../domain/schemas/country.schema';
import { ValidateCountryByNameOrAliasService } from '../domain/service/countries/validate-country-by-name-or-alias.service';
import { CountriesMongoose } from './repository/countries/countries-mongoose.repository';
import { State, StateSchema } from '../domain/schemas/state.schema';
import { ValidateStateByNameOrAliasService } from '../domain/service/states/validate-state-by-name-or-alias.service';
import { StatesMongoose } from './repository/states/states-mongoose.repository';
import { City, CitySchema } from '../domain/schemas/city.schema';
import { ValidateCityByNameOrAliasService } from '../domain/service/cities/validate-city-by-name-or-alias.service';
import { CitiesMongoose } from './repository/cities/cities-mongoose.repository';
import { ValidateInputParamsService } from '../domain/service/validate-input-params.service';
import { GetCitiesByStateService } from '../domain/service/cities/get-cities-by-state.service';
import { CitiesController } from './controller/cities.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forFeature([
      { name: Country.name, schema: CountrySchema },
      { name: State.name, schema: StateSchema },
      { name: City.name, schema: CitySchema }
    ])
  ],
  controllers: [CitiesController],
  providers: [
    CountriesMongoose,
    StatesMongoose,
    CitiesMongoose,
    ValidateCountryByNameOrAliasService,
    ValidateStateByNameOrAliasService,
    ValidateCityByNameOrAliasService,
    ValidateInputParamsService,
    GetCitiesByStateService
  ]
})
export class CitiesModule {}
