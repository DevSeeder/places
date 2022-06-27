import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { State, StateSchema } from '../domain/schemas/state.schema';
import { ValidateStateByNameOrAliasService } from '../domain/service/states/validate-state-by-name-or-alias.service';
import { StatesMongoose } from './repository/states/states-mongoose.repository';
import { GetStateByCountryService } from '../domain/service/states/get-states-by-country.service';
import { StatesController } from './controller/states.controller';
import { CountriesModule } from './countries.module';
import { ValidateCountryByNameOrAliasService } from '../domain/service/countries/validate-country-by-name-or-alias.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forFeature([{ name: State.name, schema: StateSchema }]),
    CountriesModule
  ],
  controllers: [StatesController],
  providers: [
    StatesMongoose,
    ValidateStateByNameOrAliasService,
    ValidateCountryByNameOrAliasService,
    GetStateByCountryService
  ],
  exports: [
    StatesMongoose,
    ValidateCountryByNameOrAliasService,
    ValidateStateByNameOrAliasService
  ]
})
export class StatesModule {}
