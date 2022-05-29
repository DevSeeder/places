import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { AbstractExceptionFilter } from './abstract-exception.filter';
import { CustomExceptionReponse } from '../interface/custom-exception-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter extends AbstractExceptionFilter<HttpException> {
  getResponse(_host: ArgumentsHost, exception: HttpException): any {
    return exception.getResponse();
  }

  makeCustomResponse(exception: HttpException): CustomExceptionReponse {
    return {
      status: exception.getStatus(),
      message: exception.message,
      type: exception.name,
      errorCode: exception.getStatus()
    };
  }
}
