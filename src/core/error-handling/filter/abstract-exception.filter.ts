import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { CustomExceptionReponse } from '../interface/custom-exception-response.interface';

@Catch()
export abstract class AbstractExceptionFilter<ExceptionType>
  implements ExceptionFilter
{
  protected httpAdapter: AbstractHttpAdapter;
  constructor(adapterHost: HttpAdapterHost) {
    this.httpAdapter = adapterHost.httpAdapter;
  }

  getResponse(
    host: ArgumentsHost,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _exception: ExceptionType
  ): Record<string, unknown> {
    return host.switchToHttp().getResponse();
  }

  catch(exception: ExceptionType, host: ArgumentsHost) {
    const response = this.getResponse(host, exception);

    const customResponse = this.makeCustomResponse(exception);

    console.error(customResponse);

    this.httpAdapter.reply(response, customResponse, customResponse.status);
  }

  abstract makeCustomResponse(exception: ExceptionType): CustomExceptionReponse;
}
