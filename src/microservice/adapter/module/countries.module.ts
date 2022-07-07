import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from '../../domain/schemas/country.schema';
import { CountriesMongoose } from '../repository/countries/countries-mongoose.repository';
import { CountriesController } from '../controller/countries.controller';
import { GetCountriesService } from '../../domain/service/countries/get-countries.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }])
  ],
  controllers: [CountriesController],
  providers: [CountriesMongoose, GetCountriesService],
  exports: [CountriesMongoose]
})
export class CountriesModule {}
