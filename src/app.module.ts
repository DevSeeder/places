import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { ExtensionsModule } from './adapter/helper/extensions/exensions.module';
import { NeighborhoodsModule } from './adapter/neighborhoods.module';

@Module({
  imports: [
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
