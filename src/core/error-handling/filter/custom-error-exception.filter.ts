import { Catch } from '@nestjs/common';
import { CustomErrorException } from '../exception/custom-error.exception';
import { AbstractExceptionFilter } from './abstract-exception.filter';
import { CustomExceptionReponse } from '../interface/custom-exception-response.interface';

@Catch(CustomErrorException)
export class CustomErrorExceptionFilter extends AbstractExceptionFilter<CustomErrorException> {
  makeCustomResponse(exception: CustomErrorException): CustomExceptionReponse {
    return {
      status: exception.getStatus(),
      message: exception.message,
      type: exception.type,
      errorCode: exception.errCode
    };
  }
}
