import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { Country, CountrySchema } from '../domain/schemas/country.schema';
import { CountriesMongoose } from './repository/countries/countries-mongoose.repository';
import { CountriesController } from './controller/countries.controller';
import { GetCountriesService } from '../domain/service/countries/get-countries.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }])
  ],
  controllers: [CountriesController],
  providers: [CountriesMongoose, GetCountriesService]
})
export class CountriesModule {}
