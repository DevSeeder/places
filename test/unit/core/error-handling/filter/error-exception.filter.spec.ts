import { Test, TestingModule } from '@nestjs/testing';
import { ExtensionsModule } from '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { FiltersModule } from '../../../../../src/core/error-handling/filters.module';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { ErrorExceptionFilter } from '../../../../../src/core/error-handling/filter/error-exception.filter';
import { CustomErrorException } from '../../../../../src/core/error-handling/exception/custom-error.exception';

describe('ErrorExceptionFilter', () => {
  let sut: ErrorExceptionFilter;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [ExtensionsModule, FiltersModule],
      controllers: [],
      providers: [ErrorExceptionFilter]
    }).compile();

    sut = app.get<ErrorExceptionFilter>(ErrorExceptionFilter);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('makeCustomResponse', () => {
    it('should call makeCustomResponse and return the correct response', async () => {
      const mockException = new Error('any_error');
      const mockResponse = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `any_error`,
        type: mockException.name,
        errorCode: -1
      };
      const actual = await sut.makeCustomResponse(mockException);
      expect(JSON.stringify(actual)).to.be.equal(JSON.stringify(mockResponse));
    });
  });

  describe('getStatus', () => {
    it('should call getStatus and return the correct value for error instance', async () => {
      const mockException = new Error('any_error');
      const actual = await sut.getStatus(mockException);
      expect(actual).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should call getStatus and return the correct value for HttpException instance', async () => {
      const mockException = new NotFoundException();
      const actual = await sut.getStatus(mockException);
      expect(actual).to.be.equal(HttpStatus.NOT_FOUND);
    });
  });

  describe('getErrCode', () => {
    it('should call getErrCode and return the correct value for error instance', async () => {
      const mockException = new Error('any_error');
      const actual = await sut.getErrCode(mockException);
      expect(actual).to.be.equal(-1);
    });

    it('should call getErrCode and return the correct value for CustomErrorException instance', async () => {
      const mockException = new CustomErrorException(
        'any',
        HttpStatus.INTERNAL_SERVER_ERROR,
        10
      );
      const actual = await sut.getErrCode(mockException);
      expect(actual).to.be.equal(10);
    });

    it('should call getErrCode and return the correct value for HttpException instance', async () => {
      const mockException = new NotFoundException();
      const actual = await sut.getErrCode(mockException);
      expect(actual).to.be.equal(HttpStatus.NOT_FOUND);
    });
  });
});
