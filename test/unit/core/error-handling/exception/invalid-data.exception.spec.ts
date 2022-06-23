import '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { HttpStatus } from '@nestjs/common';
import { InvalidDataException } from '../../../../../src/core/error-handling/exception/invalid-data.exception';

describe('InvalidDataExeception ', () => {
  it('Should call instanciate InvalidDataExeception correctly', function () {
    const exception = new InvalidDataException('any', 'any_value');
    expect(exception.message).to.be.equal(`Invalid Any 'any_value'`);
    expect(exception.getStatus()).to.be.equal(HttpStatus.NOT_ACCEPTABLE);
    expect(exception.errCode).to.be.equal(3);
  });
});
