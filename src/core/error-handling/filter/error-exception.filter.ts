import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { AbstractExceptionFilter } from './abstract-exception.filter';
import { CustomExceptionReponse } from '../interface/custom-exception-response.interface';
import { CustomErrorException } from '../exception/custom-error.exception';

@Catch()
export class ErrorExceptionFilter extends AbstractExceptionFilter<Error> {
  makeCustomResponse(exception: any): CustomExceptionReponse {
    return {
      status: this.getStatus(exception),
      message: exception.message,
      type: exception.name,
      errorCode: this.getErrCode(exception)
    };
  }

  getStatus(exception: any): number {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) status = exception.getStatus();

    return status;
  }

  getErrCode(exception: any): number {
    let errCode = -1;

    if (exception instanceof HttpException) errCode = exception.getStatus();

    if (exception instanceof CustomErrorException) errCode = exception.errCode;

    return errCode;
  }
}
