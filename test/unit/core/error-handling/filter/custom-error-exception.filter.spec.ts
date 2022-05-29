import { Test, TestingModule } from '@nestjs/testing';
import { ExtensionsModule } from '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { FiltersModule } from '../../../../../src/core/error-handling/filters.module';
import { HttpStatus } from '@nestjs/common';
import { CustomErrorExceptionFilter } from '../../../../../src/core/error-handling/filter/custom-error-exception.filter';
import { EmptyPropException } from '../../../../../src/core/error-handling/exception/empty-prop.exception';

describe('CustomErrorExceptionFilter', () => {
  let sut: CustomErrorExceptionFilter;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [ExtensionsModule, FiltersModule],
      controllers: [],
      providers: [CustomErrorExceptionFilter]
    }).compile();

    sut = app.get<CustomErrorExceptionFilter>(CustomErrorExceptionFilter);
  });

  afterEach(async () => {
    await app.close();
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
});
