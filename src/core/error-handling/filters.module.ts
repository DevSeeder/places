import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CustomErrorExceptionFilter } from './filter/custom-error-exception.filter';
import { ErrorExceptionFilter } from './filter/error-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { MongoDBExceptionFilter } from './filter/mongodb-exception.filter';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: CustomErrorExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: MongoDBExceptionFilter
    }
  ]
})
export class FiltersModule {}
