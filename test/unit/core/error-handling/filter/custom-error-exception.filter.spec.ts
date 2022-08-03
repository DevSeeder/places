import { Test, TestingModule } from '@nestjs/testing';
import { ExtensionsModule } from '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { FiltersModule } from '../../../../../src/core/error-handling/filters.module';
import { HttpStatus, INestApplication, Module } from '@nestjs/common';
import { CustomErrorExceptionFilter } from '../../../../../src/core/error-handling/filter/custom-error-exception.filter';
import { EmptyPropException } from '../../../../../src/core/error-handling/exception/empty-prop.exception';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import * as sinon from 'sinon';
import { NestFactory } from '@nestjs/core';
import { Neighborhood } from '../../../../../src/microservice/domain/schemas/neighborhood.schema';
import {
  mockModelMongoose,
  mockMongooseConnection
} from '../../../../mock/mongoose/mock-mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { State } from '../../../../../src/microservice/domain/schemas/state.schema';
import { Country } from '../../../../../src/microservice/domain/schemas/country.schema';
import { City } from '../../../../../src/microservice/domain/schemas/city.schema';
import {
  AmqpConnection,
  AmqpConnectionManager
} from '@golevelup/nestjs-rabbitmq';
import {
  mockAmqpConnection,
  mockAmqpConnectionManager
} from '../../../../mock/amqp/aqmp-conneciton.mock';

jest.setTimeout(20000);

describe('CustomErrorExceptionFilter', () => {
  let sut: CustomErrorExceptionFilter;
  let app: TestingModule;
  let server: INestApplication;

  @Module({})
  class GenericMockedModule {}

  beforeAll(async () => {
    jest.mock('mongoose', mockMongooseConnection);
  });

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [ExtensionsModule, FiltersModule],
      controllers: [],
      providers: [CustomErrorExceptionFilter]
    })
      .overrideProvider(getModelToken(Neighborhood.name))
      .useValue(mockModelMongoose)
      .overrideProvider(getModelToken(Country.name))
      .useValue(mockModelMongoose)
      .overrideProvider(getModelToken(State.name))
      .useValue(mockModelMongoose)
      .overrideProvider(getModelToken(City.name))
      .useValue(mockModelMongoose)
      .overrideProvider(AmqpConnectionManager)
      .useValue(mockAmqpConnectionManager)
      .overrideProvider(AmqpConnection)
      .useValue(mockAmqpConnection)
      .compile();

    sut = app.get<CustomErrorExceptionFilter>(CustomErrorExceptionFilter);

    server = await NestFactory.create(GenericMockedModule);
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
