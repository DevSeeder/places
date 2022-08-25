import { Module } from '@nestjs/common';
import { LogExecutionsModule } from './logexecutions.module';
import { LogActionsModule } from './logactions.module';
import { ResolutionService } from '../../domain/service/resolution/resolution.service';
import { ProcessResolutionIsNotACityService } from '../../domain/service/resolution/process/city/process-resolution-is-not-a-city.service';
import { ResolutionController as ResolutionsController } from '../controller/resolutions.controller';
import { LogSeedModule } from './logseed.module';
import { ProcessResolutionWrongCityNameService } from '../../domain/service/resolution/process/city/process-resolution-wrong-city-name.service';
import { ProcessResolutionUniqueNeighborhoodService } from '../../domain/service/resolution/process/city/process-resolution-unique-neighborhood.service';
import { NeighborhoodsModule } from './neighborhoods.module';
import { CitiesModule } from './cities.module';
import { StatesModule } from './states.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    LogExecutionsModule,
    LogActionsModule,
    LogSeedModule,
    NeighborhoodsModule,
    CitiesModule,
    StatesModule,
    AuthModule
  ],
  controllers: [ResolutionsController],
  providers: [
    ResolutionService,
    ProcessResolutionIsNotACityService,
    ProcessResolutionWrongCityNameService,
    ProcessResolutionUniqueNeighborhoodService
  ],
  exports: [ResolutionService]
})
export class ResolutionsModule {}
