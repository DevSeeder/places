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
import { GetStateByCountryService } from '../domain/service/states/get-states-by-country.service';
import { StatesController } from './controller/states.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forFeature([
      { name: Country.name, schema: CountrySchema },
      { name: State.name, schema: StateSchema }
    ])
  ],
  controllers: [StatesController],
  providers: [
    CountriesMongoose,
    StatesMongoose,
    ValidateCountryByNameOrAliasService,
    ValidateStateByNameOrAliasService,
    GetStateByCountryService
  ]
})
export class StatesModule {}
