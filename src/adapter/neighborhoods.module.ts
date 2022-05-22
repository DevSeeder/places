import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PuppeteerModule } from 'nest-puppeteer';
import { NeighborhoodsController } from './controller/neighborhoods.controller';
import { GuiaMaisRepository } from './repository/guia-mais.repository';
import { NeighborhoodsService } from './service/neighborhoods.service';

@Module({
  imports: [
    PuppeteerModule.forFeature(),
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [NeighborhoodsController],
  providers: [
    {
      provide: 'GuiaMaisRepository',
      useClass: GuiaMaisRepository
    },
    {
      provide: 'GUIA_MAIS_NEIGHBORHOODS_URL',
      useValue: process.env.GUIA_MAIS_NEIGHBORHOODS_URL
    },
    NeighborhoodsService
  ]
})
export class NeighborhoodsModule {}
