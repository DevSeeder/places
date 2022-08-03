import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';
import {
  NestInterceptor,
  Injectable,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';

import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NestResponse } from './nest-response';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  private readonly httpAdapter: AbstractHttpAdapter;

  constructor(adapterHost: HttpAdapterHost) {
    this.httpAdapter = adapterHost.httpAdapter;
  }

  /* istanbul ignore next */
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> | Promise<Observable<any>> {
    if (isRabbitContext(context)) return next.handle();
    return next.handle().pipe(
      /* istanbul ignore next */
      map(
        /* istanbul ignore next */
        (responseController: NestResponse) => {
          if (typeof responseController == 'undefined') return null;
          return this.interceptResponse(responseController, context);
        }
      )
    );
  }

  interceptResponse(
    responseController: NestResponse,
    context: ExecutionContext
  ) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const { headers, status, body } = responseController;

    const headersName = Object.getOwnPropertyNames(headers);

    headersName.forEach((header) => {
      const headerValue = headers[header];
      this.httpAdapter.setHeader(response, header, headerValue);
    });

    this.httpAdapter.status(response, status);

    return body;
  }
}
