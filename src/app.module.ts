import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { PuppeteerModule } from 'nest-puppeteer';
import { FiltersModule } from './core/error-handling/filters.module';
import { TransformResponseInterceptor } from './core/http/transform-response.interceptor';
import { ExtensionsModule } from './microservice/adapter/helper/extensions/exensions.module';
import { NeighborhoodsModule } from './microservice/adapter/neighborhoods.module';

@Module({
  imports: [
    FiltersModule,
    ExtensionsModule,
    PuppeteerModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('database.mongodb.connection')
      })
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
