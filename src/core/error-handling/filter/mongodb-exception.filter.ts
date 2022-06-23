import { Catch, HttpStatus } from '@nestjs/common';
import { AbstractExceptionFilter } from './abstract-exception.filter';
import { CustomExceptionReponse } from '../interface/custom-exception-response.interface';
import { MongoDBException } from '../exception/mongodb-.exception';

@Catch(MongoDBException)
export class MongoDBExceptionFilter extends AbstractExceptionFilter<MongoDBException> {
  makeCustomResponse(exception: MongoDBException): CustomExceptionReponse {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: exception.message,
      type: exception.name,
      errorCode: exception.errCode
    };
  }
}
