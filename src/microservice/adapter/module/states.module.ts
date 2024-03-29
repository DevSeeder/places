import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { State, StateSchema } from '../../domain/schemas/state.schema';
import { ValidateStateByNameOrAliasService } from '../../domain/service/states/validate-state-by-name-or-alias.service';
import { StatesMongoose } from '../repository/states/states-mongoose.repository';
import { GetStatesByCountryService } from '../../domain/service/states/get-states-by-country.service';
import { StatesController } from '../controller/states.controller';
import { CountriesModule } from './countries.module';
import { ValidateCountryByNameOrAliasService } from '../../domain/service/countries/validate-country-by-name-or-alias.service';
import { UpdateStatesByRegionService } from '../../domain/service/states/update-states-by-region.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: State.name, schema: StateSchema }]),
    CountriesModule,
    AuthModule
  ],
  controllers: [StatesController],
  providers: [
    StatesMongoose,
    ValidateStateByNameOrAliasService,
    ValidateCountryByNameOrAliasService,
    GetStatesByCountryService,
    UpdateStatesByRegionService
  ],
  exports: [
    StatesMongoose,
    ValidateCountryByNameOrAliasService,
    ValidateStateByNameOrAliasService,
    UpdateStatesByRegionService,
    GetStatesByCountryService
  ]
})
export class StatesModule {}
