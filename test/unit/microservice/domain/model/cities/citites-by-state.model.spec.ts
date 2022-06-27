import { expect } from 'chai';
import { CityResponse } from '../../../../../../src/microservice/domain/model/cities/city-response.model';

describe('CitiesByState', () => {
  it('should instance CitiesByState and return the object with the correct properties', async () => {
    const model = new CityResponse();
    model.name = 'Torres';
    model.stateCode = 'RS';

    expect(model.name).to.be.equal('Torres');
    expect(model.stateCode).to.be.equal('RS');
  });
});
