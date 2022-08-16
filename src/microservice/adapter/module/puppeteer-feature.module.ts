import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { GuiaMaisRepository } from '../repository/neighborhoods/puppeteer/guia-mais.repository';
import { ConfigurationModule } from './configuration.module';

@Module({
  imports: [ConfigurationModule, PuppeteerModule.forFeature()],
  controllers: [],
  providers: [
    {
      provide: 'GuiaMaisRepository',
      useClass: GuiaMaisRepository
    }
  ],
  exports: ['GuiaMaisRepository']
})
export class PuppeteerFeatureModule {}
