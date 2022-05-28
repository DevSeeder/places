import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PuppeteerModule } from 'nest-puppeteer';
import { FiltersModule } from './core/error-handling/filters.module';
import { TransformResponseInterceptor } from './core/http/transform-response-interceptor';
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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor
    }
  ]
})
export class AppModule {}
