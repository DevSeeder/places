import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { AbstractExceptionFilter } from './abstract-exception.filter';
import { CustomExceptionReponse } from '../interface/custom-exception-response.interface';

@Catch()
export class ErrorExceptionFilter extends AbstractExceptionFilter<Error> {
  makeCustomResponse(exception: any): CustomExceptionReponse {
    return {
      status: this.getStatus(exception),
      message: exception.message,
      type: exception.name,
      errorCode: this.getStatus(exception),
      errInstance: exception
    };
  }

  getStatus(exception: any): number {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) status = exception.getStatus();

    return status;
  }
}
