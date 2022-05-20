import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { NeighborhoodsController } from './controller/neighborhoods.controller';
import { GuiaMaisRepository } from './repository/guia-mais.repository';
import { NeighborhoodsService } from './service/neighborhoods.service';

@Module({
  imports: [PuppeteerModule.forFeature()],
  controllers: [NeighborhoodsController],
  providers: [
    {
      provide: 'GuiaMaisRepository',
      useClass: GuiaMaisRepository
    },
    NeighborhoodsService
  ]
})
export class NeighborhoodsModule {}
