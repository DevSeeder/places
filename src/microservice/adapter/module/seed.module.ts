import { forwardRef, Module } from '@nestjs/common';
import { SeedNeighborhoodsByStateService } from '../../domain/service/seed/neighborhoods/seed-neighborhoods-by-state.service';
import { SeedController } from '../controller/seed.controller';
import { NeighborhoodsModule } from './neighborhoods.module';
import { CitiesModule } from './cities.module';
import { SeedNeighborhoodsByCityService } from '../../domain/service/seed/neighborhoods/seed-neighborhoods-by-city.service';
import { GuiaMaisRepository } from '../repository/neighborhoods/puppeteer/guia-mais.repository';
import { AMQPModule } from './amqp.module';
import { PublishSeedNeighborhoodsByCityService } from '../../domain/service/seed/neighborhoods/publish/publish-seed-neighborhoods-by-city.service';
import { ProcessSeedNeighborhoodsByCityService } from '../../domain/service/seed/neighborhoods/process/process-seed-neighborhoods-by-city.service';
import { LogSeedModule } from './logseed.module';
import { PuppeteerFeatureModule } from './puppeteer-feature.module';

@Module({
  imports: [
    PuppeteerFeatureModule,
    CitiesModule,
    AMQPModule,
    LogSeedModule,
    forwardRef(() => NeighborhoodsModule)
  ],
  controllers: [SeedController],
  providers: [
    {
      provide: 'GuiaMaisRepository',
      useClass: GuiaMaisRepository
    },
    SeedNeighborhoodsByStateService,
    SeedNeighborhoodsByCityService,
    PublishSeedNeighborhoodsByCityService,
    ProcessSeedNeighborhoodsByCityService
  ],
  exports: [SeedNeighborhoodsByCityService]
})
export class SeedModule {}