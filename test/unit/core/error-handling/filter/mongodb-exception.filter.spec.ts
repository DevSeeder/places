import { Test, TestingModule } from '@nestjs/testing';
import { ExtensionsModule } from '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { FiltersModule } from '../../../../../src/core/error-handling/filters.module';
import { MongoDBExceptionFilter } from '../../../../../src/core/error-handling/filter/mongodb-exception.filter';
import { HttpStatus } from '@nestjs/common';
import { MongoDBException } from '../../../../../src/core/error-handling/exception/mongodb-.exception';

describe('MongoDBExceptionFilter', () => {
  let sut: MongoDBExceptionFilter;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [ExtensionsModule, FiltersModule],
      controllers: [],
      providers: [MongoDBExceptionFilter]
    }).compile();

    sut = app.get<MongoDBExceptionFilter>(MongoDBExceptionFilter);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('makeCustomResponse', () => {
    it('should call makeCustomResponse and return the correct response', async () => {
      const mockException = new MongoDBException('mongo error', 4);
      const mockResponse = {
        status: HttpStatus.BAD_REQUEST,
        message: 'mongo error',
        type: 'MongoDBException',
        errorCode: 4
      };
      const actual = await sut.makeCustomResponse(mockException);
      expect(JSON.stringify(actual)).to.be.equal(JSON.stringify(mockResponse));
    });
  });
});
