import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { FiltersModule } from './core/error-handling/filters.module';
import { TransformResponseInterceptor } from './core/http/transform-response.interceptor';
import { CitiesModule } from './microservice/adapter/module/cities.module';
import { CountriesModule } from './microservice/adapter/module/countries.module';
import { ExtensionsModule } from './microservice/adapter/helper/extensions/exensions.module';
import { CustomPuppeteerModule } from './microservice/adapter/helper/modules/custom-puppeteer.module';
import { NeighborhoodsModule } from './microservice/adapter/module/neighborhoods.module';
import { SeedModule } from './microservice/adapter/module/seed.module';
import { StatesModule } from './microservice/adapter/module/states.module';
import { ResolutionsModule } from './microservice/adapter/module/resolution.module';

@Module({
  imports: [
    FiltersModule,
    ExtensionsModule,
    CustomPuppeteerModule.forRootLaunchOptions({
      isGlobal: true,
      ignoreHTTPSErrors: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('database.mongodb.connection')
      })
    }),
    NeighborhoodsModule,
    CitiesModule,
    StatesModule,
    CountriesModule,
    SeedModule,
    ResolutionsModule
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
