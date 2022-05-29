import { Test, TestingModule } from '@nestjs/testing';
import { ExtensionsModule } from '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { FiltersModule } from '../../../../../src/core/error-handling/filters.module';
import { HttpExceptionFilter } from '../../../../../src/core/error-handling/filter/http-exception.filter';
import { HttpStatus, NotFoundException } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let sut: HttpExceptionFilter;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [ExtensionsModule, FiltersModule],
      controllers: [],
      providers: [HttpExceptionFilter]
    }).compile();

    sut = app.get<HttpExceptionFilter>(HttpExceptionFilter);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('getResponse', () => {
    it('should call getResponse and return the correct response', async () => {
      const mockException = new NotFoundException('http');
      const mockResponse = {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'http',
        error: 'Not Found'
      };
      const actual = await sut.getResponse(null, mockException);
      expect(JSON.stringify(actual)).to.be.equal(JSON.stringify(mockResponse));
    });
  });

  describe('makeCustomResponse', () => {
    it('should call makeCustomResponse and return the correct response', async () => {
      const mockException = new NotFoundException('http');
      const mockResponse = {
        status: HttpStatus.NOT_FOUND,
        message: 'http',
        type: 'NotFoundException',
        errorCode: HttpStatus.NOT_FOUND
      };
      const actual = await sut.makeCustomResponse(mockException);
      expect(JSON.stringify(actual)).to.be.equal(JSON.stringify(mockResponse));
    });
  });
});
