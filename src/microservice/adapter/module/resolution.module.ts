import { Module } from '@nestjs/common';
import { LogExecutionsModule } from './logexecutions.module';
import { LogActionsModule } from './logactions.module';
import { ResolutionService } from '../../domain/service/resolution/resolution.service';
import { ProcessResolutionIsNotACityService } from '../../domain/service/resolution/process/process-resolution-is-not-a-city.service';
import { CitiesModule } from './cities.module';
import { ResolutionController as ResolutionsController } from '../controller/resolutions.controller';
import { LogSeedModule } from './logseed.module';

@Module({
  imports: [LogExecutionsModule, LogActionsModule, LogSeedModule, CitiesModule],
  controllers: [ResolutionsController],
  providers: [ResolutionService, ProcessResolutionIsNotACityService],
  exports: [ResolutionService]
})
export class ResolutionsModule {}
