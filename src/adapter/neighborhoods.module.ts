import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PuppeteerModule } from 'nest-puppeteer';
import { NeighborhoodsController } from './controller/neighborhoods.controller';
import { GuiaMaisRepository } from './repository/neighborhoods/guia-mais.repository';
import { NeighborhoodsService } from './service/neighborhoods.service';
import configuration from '../config/configuration';

@Module({
  imports: [
    PuppeteerModule.forFeature(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    })
  ],
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
