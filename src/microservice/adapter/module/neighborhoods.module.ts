import { forwardRef, Module } from '@nestjs/common';
import { NeighborhoodsController } from '../controller/neighborhoods.controller';
import { GetNeighborhoodsByCityService } from '../../domain/service/neighborhoods/get/get-neighborhoods-by-city.service';
import { NeighborhoodsMongoose } from '../repository/neighborhoods/neighborhoods-mongoose.repository';
import {
  Neighborhood,
  NeighborhoodSchema
} from '../../domain/schemas/neighborhood.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SaveNeighborhoodsByCityService } from '../../domain/service/neighborhoods/save-neighborhoods-by-city.service';
import { GetNeighborhoodsByStateService } from '../../domain/service/neighborhoods/get/get-neighborhoods-by-state.service';
import { CitiesModule } from './cities.module';
import { SeedNeighborhoodsModule } from './seed/seed-neighborhoods.module';
import { NeighborhoodsByCityService } from '../../domain/service/neighborhoods/neighborhoods-by-city.service';
import { GetNeighborhoodsByCountryService } from '../../domain/service/neighborhoods/get/get-neighborhoods-by-country.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Neighborhood.name, schema: NeighborhoodSchema }
    ]),
    CitiesModule,
    forwardRef(() => SeedNeighborhoodsModule)
  ],
  controllers: [NeighborhoodsController],
  providers: [
    NeighborhoodsMongoose,
    GetNeighborhoodsByCityService,
    GetNeighborhoodsByStateService,
    GetNeighborhoodsByCountryService,
    NeighborhoodsByCityService,
    SaveNeighborhoodsByCityService
  ],
  exports: [
    NeighborhoodsMongoose,
    GetNeighborhoodsByCityService,
    GetNeighborhoodsByStateService,
    GetNeighborhoodsByCountryService,
    SaveNeighborhoodsByCityService
  ]
})
export class NeighborhoodsModule {}
