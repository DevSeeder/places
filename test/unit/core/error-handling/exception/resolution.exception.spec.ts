import '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { HttpStatus } from '@nestjs/common';
import { ResolutionException } from '../../../../../src/core/error-handling/exception/resolution.exception';

describe('ResolutionException ', () => {
  it('Should call instanciate ResolutionException correctly', function () {
    const exception = new ResolutionException('any');
    expect(exception.message).to.be.equal('any');
    expect(exception.getStatus()).to.be.equal(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(exception.errCode).to.be.equal(6);
  });
});
