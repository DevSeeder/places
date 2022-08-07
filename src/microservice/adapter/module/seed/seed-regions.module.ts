import { Module } from '@nestjs/common';
import { PuppeteerFeatureModule } from '../puppeteer-feature.module';
import { SeedRegionsByCountryService } from '../../../domain/service/seed/regions/seed-regions-by-country.service';
import { StatesModule } from '../states.module';
import { RegionsController } from '../../controller/regions.controller';

@Module({
  imports: [PuppeteerFeatureModule, StatesModule],
  controllers: [RegionsController],
  providers: [SeedRegionsByCountryService],
  exports: [SeedRegionsByCountryService]
})
export class SeedRegionsModule {}
