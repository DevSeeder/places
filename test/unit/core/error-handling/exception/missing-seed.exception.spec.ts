import '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { MissingSeedException } from '../../../../../src/core/error-handling/exception/missing-seed.exception';

describe('MissingSeedException ', () => {
  it('Should call instanciate MissingSeedException correctly', function () {
    const exception = new MissingSeedException(0, 0, 'Country', 'Countries');
    expect(exception.message).to.be.equal('No Country has been seeded');
    expect(exception.getStatus()).to.be.equal(500);
    expect(exception.errCode).to.be.equal(5);
  });
});
