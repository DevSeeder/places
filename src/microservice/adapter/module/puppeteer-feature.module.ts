import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { PuppeteerService } from '../../domain/service/puppeteer/puppeteer.service';
import { GuiaMaisRepository } from '../repository/neighborhoods/puppeteer/guia-mais.repository';
import { CityPopulationRepository } from '../repository/regions/puppeteer/citypopulation.repository';
import { ConfigurationModule } from './configuration.module';

@Module({
  imports: [ConfigurationModule, PuppeteerModule.forFeature()],
  controllers: [],
  providers: [
    PuppeteerService,
    {
      provide: 'GuiaMaisRepository',
      useClass: GuiaMaisRepository
    },
    {
      provide: 'CityPopulationRepository',
      useClass: CityPopulationRepository
    }
  ],
  exports: ['GuiaMaisRepository', 'CityPopulationRepository', PuppeteerService]
})
export class PuppeteerFeatureModule {}
