import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { FiltersModule } from './error-handling/filters.module';
import { ExtensionsModule } from './places-interface/adapter/helper/extensions/exensions.module';
import { NeighborhoodsModule } from './places-interface/adapter/neighborhoods.module';

@Module({
  imports: [
    FiltersModule,
    ExtensionsModule,
    PuppeteerModule.forRoot({
      isGlobal: true
    }),
    NeighborhoodsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
