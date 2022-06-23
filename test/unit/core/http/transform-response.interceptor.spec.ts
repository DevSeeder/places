import '../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { TransformResponseInterceptor } from '../../../../src/core/http/transform-response.interceptor';
import {
  ExecutionContext,
  HttpStatus,
  INestApplication,
  ValidationPipe
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../../src/app.module';
import { createMock } from '@golevelup/ts-jest';
import { NestResponse } from '../../../../src/core/http/nest-response';
import { NestResponseBuilder } from '../../../../src/core/http/nest-response.builder';
import { CustomResponse } from '../../../../src/core/interface/custom-response.interface';
import { of } from 'rxjs';
import * as sinon from 'sinon';
import { mockMongooseConnection } from '../../../mock/mongoose/mock-mongoose';

jest.setTimeout(22000);

describe('TransformResponseInterceptor ', () => {
  let app: INestApplication;
  let mockAdapter;

  const callHandler = {
    handle: jest.fn(() => of([mockNestResponse()]))
  };

  beforeAll(async () => {
    jest.mock('mongoose', mockMongooseConnection);
  });

  beforeEach(async function () {
    app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true
      })
    );
    app.init();
    mockAdapter = {
      httpAdapter: await app.getHttpAdapter()
    };
  });

  afterEach(async function () {
    await app.close();
  });

  const mockCustomResponse: CustomResponse = {
    success: true,
    response: 'any_data'
  };

  const mockNestResponse = (): NestResponse => {
    const builder = new NestResponseBuilder();
    builder.setStatus(HttpStatus.OK);
    builder.setBody(mockCustomResponse);
    builder.setHeader({
      accept: 'application/json'
    });
    return builder.build();
  };

  describe('intercept', function () {
    it('Should call instanciate TransformResponseInterceptor correctly', async function () {
      const mockExecutionContext = createMock<ExecutionContext>();

      const sut = new TransformResponseInterceptor(mockAdapter);

      const actual = await sut.intercept(mockExecutionContext, callHandler);

      expect(typeof actual).to.be.equal('object');
    });
  });

  describe('interceptResponse', function () {
    it('Should call instanciate TransformResponseInterceptor correctly', async function () {
      const mockExecutionContext = createMock<ExecutionContext>();
      const sut = new TransformResponseInterceptor(mockAdapter);
      const adapterStatusSpy = sinon.spy(mockAdapter.httpAdapter, 'status');
      const adapterHeaderSpy = sinon.spy(mockAdapter.httpAdapter, 'setHeader');

      const actual = await sut.interceptResponse(
        mockNestResponse(),
        mockExecutionContext
      );

      sinon.assert.calledOnce(adapterStatusSpy);
      sinon.assert.calledOnce(adapterHeaderSpy);

      expect(actual).to.be.equal(mockNestResponse().body);

      adapterHeaderSpy.restore();
      adapterStatusSpy.restore();
    });
  });
});
