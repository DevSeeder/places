import { forwardRef, Module } from '@nestjs/common';
import { SeedNeighborhoodsByStateService } from '../../../domain/service/seed/neighborhoods/seed-neighborhoods-by-state.service';
import { SeedController } from '../../controller/seed.controller';
import { NeighborhoodsModule } from '../neighborhoods.module';
import { CitiesModule } from '../cities.module';
import { SeedNeighborhoodsByCityService } from '../../../domain/service/seed/neighborhoods/seed-neighborhoods-by-city.service';
import { AMQPModule } from '../amqp.module';
import { PublishSeedNeighborhoodsByCityService } from '../../../domain/service/seed/neighborhoods/publish/publish-seed-neighborhoods-by-city.service';
import { ProcessSeedNeighborhoodsByCityService } from '../../../domain/service/seed/neighborhoods/process/process-seed-neighborhoods-by-city.service';
import { LogSeedModule } from '../logseed.module';
import { PuppeteerFeatureModule } from '../puppeteer-feature.module';
import { SeedNeighborhoodsByCountryService } from '../../../domain/service/seed/neighborhoods/seed-neighborhoods-by-country.service';
import { PublishSeedNeighborhoodsByStateService } from '../../../domain/service/seed/neighborhoods/publish/publish-seed-neighborhoods-by-state.service';
import { ProcessSeedNeighborhoodsByStateService } from '../../../domain/service/seed/neighborhoods/process/process-seed-neighborhoods-by-state.service';
import { CountriesModule } from '../countries.module';
import { StatesModule } from '../states.module';
import { AuthModule } from '../auth.module';

@Module({
  imports: [
    PuppeteerFeatureModule,
    AMQPModule,
    AuthModule,
    LogSeedModule,
    CountriesModule,
    StatesModule,
    CitiesModule,
    forwardRef(() => NeighborhoodsModule)
  ],
  controllers: [SeedController],
  providers: [
    SeedNeighborhoodsByCountryService,
    SeedNeighborhoodsByStateService,
    SeedNeighborhoodsByCityService,
    PublishSeedNeighborhoodsByCityService,
    PublishSeedNeighborhoodsByStateService,
    ProcessSeedNeighborhoodsByCityService,
    ProcessSeedNeighborhoodsByStateService
  ],
  exports: [SeedNeighborhoodsByCityService, SeedNeighborhoodsByStateService]
})
export class SeedNeighborhoodsModule {}
