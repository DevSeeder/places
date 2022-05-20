import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { NeighborhoodsModule } from './adapter/neighborhoods.module';

@Module({
  imports: [
    PuppeteerModule.forRoot({
      isGlobal: true
    }),
    NeighborhoodsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
