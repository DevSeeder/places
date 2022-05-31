import '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { CustomErrorException } from '../../../../../src/core/error-handling/exception/custom-error.exception';

describe('EmptyDataException ', () => {
  it('Should call instanciate EmptyDataException correctly', function () {
    const exception = new CustomErrorException('any', 500);
    expect(exception.message).to.be.equal('any');
    expect(exception.getStatus()).to.be.equal(500);
    expect(exception.errCode).to.be.equal(-1);
  });
});
