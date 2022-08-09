import { Module } from '@nestjs/common';
import { PuppeteerFeatureModule } from '../puppeteer-feature.module';
import { SeedRegionsByCountryService } from '../../../domain/service/seed/regions/seed-regions-by-country.service';
import { StatesModule } from '../states.module';
import { RegionsController } from '../../controller/regions.controller';
import { GetRegionsByCountryService } from '../../../domain/service/regions/get-regions-by-country.service';
import { RegionsByCountryService } from '../../../domain/service/regions/regions-by-country.service';

@Module({
  imports: [PuppeteerFeatureModule, StatesModule],
  controllers: [RegionsController],
  providers: [
    SeedRegionsByCountryService,
    GetRegionsByCountryService,
    RegionsByCountryService
  ],
  exports: [SeedRegionsByCountryService, GetRegionsByCountryService]
})
export class SeedRegionsModule {}
