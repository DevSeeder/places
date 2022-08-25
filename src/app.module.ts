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
import { SeedNeighborhoodsModule } from './microservice/adapter/module/seed/seed-neighborhoods.module';
import { StatesModule } from './microservice/adapter/module/states.module';
import { ResolutionsModule } from './microservice/adapter/module/resolution.module';
import { SeedRegionsModule } from './microservice/adapter/module/seed/seed-regions.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: config.get<string>('auth.jwt.expires')
        }
      })
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    NeighborhoodsModule,
    CitiesModule,
    StatesModule,
    CountriesModule,
    SeedNeighborhoodsModule,
    ResolutionsModule,
    SeedRegionsModule
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
