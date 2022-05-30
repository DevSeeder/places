import '../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { NestResponseBuilder } from '../../../../src/core/http/nest-response.builder';

describe('NestResponseBuilder ', () => {
  it('Should call instanciate NestResponseBuilder and set header correctly', function () {
    const mockHeaders = new Object({ anyKey: 'anyHeader' });
    const nestBuilder = new NestResponseBuilder();
    const actual = nestBuilder.setHeader(mockHeaders).build();
    expect(actual.headers).to.be.equal(mockHeaders);
  });
});
