import { Test, TestingModule } from '@nestjs/testing';
import { ExtensionsModule } from '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { FiltersModule } from '../../../../../src/core/error-handling/filters.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { CustomErrorExceptionFilter } from '../../../../../src/core/error-handling/filter/custom-error-exception.filter';
import { EmptyPropException } from '../../../../../src/core/error-handling/exception/empty-prop.exception';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import * as sinon from 'sinon';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../../../src/app.module';
import { Neighborhood } from '../../../../../src/microservice/domain/schemas/neighborhood.schema';
import { mockModelMongoose } from '../../../../mock/mongoose/mockMongooseModel';
import { getModelToken } from '@nestjs/mongoose';

jest.mock('mongoose', () => {
  return {
    createConnection: jest.fn(() => {
      return {
        asPromise: jest.fn(() => {
          return {
            model: jest.fn(),
            close: jest.fn()
          };
        })
      };
    }),
    Schema: jest.fn()
  };
});

jest.setTimeout(50000);

describe('CustomErrorExceptionFilter', () => {
  let sut: CustomErrorExceptionFilter;
  let app: TestingModule;
  let server: INestApplication;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [ExtensionsModule, FiltersModule],
      controllers: [],
      providers: [CustomErrorExceptionFilter]
    })
      .overrideProvider(getModelToken(Neighborhood.name))
      .useValue(mockModelMongoose)
      .compile();

    sut = app.get<CustomErrorExceptionFilter>(CustomErrorExceptionFilter);

    server = await NestFactory.create(AppModule);
    await server.init();
  });

  afterEach(async () => {
    await app.close();
    await server.close();
  });

  describe('makeCustomResponse', () => {
    it('should call makeCustomResponse and return the correct response', async () => {
      const mockException = new EmptyPropException('any_prop');
      const mockResponse = {
        status: HttpStatus.NOT_ACCEPTABLE,
        message: `The property 'Any_prop' cannot be empty`,
        type: 'EmptyPropException',
        errorCode: 2
      };
      const actual = await sut.makeCustomResponse(mockException);
      expect(JSON.stringify(actual)).to.be.equal(JSON.stringify(mockResponse));
    });
  });

  describe('getResponse', () => {
    it('should call getResponse and call the functions correctly', async () => {
      const mockResponse = {
        status: HttpStatus.NOT_ACCEPTABLE,
        message: `The property 'Any_prop' cannot be empty`,
        type: 'EmptyPropException',
        errorCode: 2
      };

      const mockArgHostResponse = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getResponse: () => mockResponse
        })
      });

      const mockException = new EmptyPropException('any_prop');

      const actual = await sut.getResponse(mockArgHostResponse, mockException);
      expect(JSON.stringify(actual)).to.be.equal(JSON.stringify(mockResponse));
    });
  });

  describe('catch', () => {
    it('should call catch and call the functions correctly', async () => {
      const mockException = new EmptyPropException('any_prop');

      const mockResponse = {
        status: HttpStatus.NOT_ACCEPTABLE,
        message: `The property 'Any_prop' cannot be empty`,
        type: 'EmptyPropException',
        errorCode: 2
      };

      const mockAdapterResponse = {
        status: () => HttpStatus.NOT_ACCEPTABLE,
        message: `The property 'Any_prop' cannot be empty`,
        type: 'EmptyPropException',
        errorCode: 2,
        json: () => mockResponse
      };

      const mockArgHostResponse = createMock<ExecutionContext>({
        switchToHttp: () => ({
          getResponse: () => mockAdapterResponse
        })
      });

      const getResponseSpy = sinon.spy(sut, 'getResponse');
      const makeCustomResponseSpy = sinon.spy(sut, 'makeCustomResponse');
      sinon.stub(sut, 'httpAdapter').value(server.getHttpAdapter());

      await sut.catch(mockException, mockArgHostResponse);

      sinon.assert.calledOnceWithExactly(
        getResponseSpy,
        mockArgHostResponse,
        mockException
      );

      sinon.assert.calledOnceWithExactly(makeCustomResponseSpy, mockException);

      getResponseSpy.restore();
      makeCustomResponseSpy.restore();
    });
  });
});
