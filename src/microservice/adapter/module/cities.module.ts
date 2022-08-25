import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from '../../domain/schemas/city.schema';
import { ValidateCityByNameOrAliasService } from '../../domain/service/cities/validate-city-by-name-or-alias.service';
import { CitiesMongoose } from '../repository/cities/cities-mongoose.repository';
import { ValidateInputParamsService } from '../../domain/service/validate/validate-input-params.service';
import { GetCitiesByStateService } from '../../domain/service/cities/get/get-cities-by-state.service';
import { CitiesController } from '../controller/cities.controller';
import { GetCitiesByCountryService } from '../../domain/service/cities/get/get-cities-by-country.service';
import { StatesModule } from './states.module';
import { DeleteCityByIdService } from '../../domain/service/cities/delete-city-by-id.service';
import { UpdateCityByIdService } from '../../domain/service/cities/update-city-by-id.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
    StatesModule,
    AuthModule
  ],
  controllers: [CitiesController],
  providers: [
    CitiesMongoose,
    ValidateCityByNameOrAliasService,
    ValidateInputParamsService,
    GetCitiesByStateService,
    GetCitiesByCountryService,
    DeleteCityByIdService,
    UpdateCityByIdService
  ],
  exports: [
    CitiesMongoose,
    ValidateInputParamsService,
    GetCitiesByStateService,
    GetCitiesByCountryService,
    DeleteCityByIdService,
    UpdateCityByIdService
  ]
})
export class CitiesModule {}
