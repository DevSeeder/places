import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from '../../domain/schemas/country.schema';
import { CountriesMongoose } from '../repository/countries/countries-mongoose.repository';
import { CountriesController } from '../controller/countries.controller';
import { GetCountriesService } from '../../domain/service/countries/get-countries.service';
import { ValidateCountryByNameOrAliasService } from '../../domain/service/countries/validate-country-by-name-or-alias.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
    AuthModule
  ],
  controllers: [CountriesController],
  providers: [
    CountriesMongoose,
    GetCountriesService,
    ValidateCountryByNameOrAliasService
  ],
  exports: [CountriesMongoose, ValidateCountryByNameOrAliasService]
})
export class CountriesModule {}
