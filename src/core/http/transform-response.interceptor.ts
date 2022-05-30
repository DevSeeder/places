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

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      /* istanbul ignore next */
      map((responseController: NestResponse) => {
        return this.interceptResponse(responseController, context);
      })
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
