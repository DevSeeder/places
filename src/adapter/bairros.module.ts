import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { BairrosController } from './controller/bairros.controller';
import { GuiaMaisRepository } from './repository/guia-mais.repository';
import { BairrosService } from './service/bairros.service';

@Module({
  imports: [PuppeteerModule.forFeature()],
  controllers: [BairrosController],
  providers: [
    {
      provide: 'GuiaMaisRepository',
      useClass: GuiaMaisRepository
    },
    BairrosService
  ]
})
export class BairrosModule {}
