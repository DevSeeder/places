import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { BairrosModule } from './adapter/bairros.module';
// import { BairrosModule } from './adapter/bairros.module';
import { BairrosController } from './adapter/controller/bairros.controller';
import { GuiaMaisRepository } from './adapter/repository/guia-mais.repository';
import { BairrosService } from './adapter/service/bairros.service';

@Module({
  imports: [
    PuppeteerModule.forRoot({
      isGlobal: true
    }),
    BairrosModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
