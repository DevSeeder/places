import { Module } from '@nestjs/common';
import { LogExecutionsModule } from './logexecutions.module';
import { LogActionsModule } from './logactions.module';
import { ResolutionService } from '../../domain/service/resolution/resolution.service';
import { ProcessResolutionIsNotACityService } from '../../domain/service/resolution/process/city/process-resolution-is-not-a-city.service';
import { CitiesModule } from './cities.module';
import { ResolutionController as ResolutionsController } from '../controller/resolutions.controller';
import { LogSeedModule } from './logseed.module';
import { ProcessResolutionWrongCityNameService } from '../../domain/service/resolution/process/city/process-resolution-wrong-city-name.service';

@Module({
  imports: [LogExecutionsModule, LogActionsModule, LogSeedModule, CitiesModule],
  controllers: [ResolutionsController],
  providers: [
    ResolutionService,
    ProcessResolutionIsNotACityService,
    ProcessResolutionWrongCityNameService
  ],
  exports: [ResolutionService]
})
export class ResolutionsModule {}
