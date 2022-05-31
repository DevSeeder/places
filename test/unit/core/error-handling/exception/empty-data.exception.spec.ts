import '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { EmptyDataException } from '../../../../../src/core/error-handling/exception/empty-data.exception';
import { HttpStatus } from '@nestjs/common';

describe('EmptyDataException ', () => {
  it('Should call instanciate EmptyDataException correctly', function () {
    const exception = new EmptyDataException('any');
    expect(exception.message).to.be.equal('The any data cannot be empty');
    expect(exception.getStatus()).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(exception.errCode).to.be.equal(1);
  });

  it('Should call instanciate EmptyDataException correctly with default param', function () {
    const exception = new EmptyDataException();
    expect(exception.message).to.be.equal('The  data cannot be empty');
    expect(exception.getStatus()).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(exception.errCode).to.be.equal(1);
  });
});
