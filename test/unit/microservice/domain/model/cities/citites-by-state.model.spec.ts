import { expect } from 'chai';
import { CitiesResponse } from '../../../../../../src/microservice/domain/model/cities/cities-by-state.model';

describe('CitiesByState', () => {
  it('should instance CitiesByState and return the object with the correct properties', async () => {
    const model = new CitiesResponse();
    model.name = 'Torres';
    model.stateCode = 'RS';

    expect(model.name).to.be.equal('Torres');
    expect(model.stateCode).to.be.equal('RS');
  });
});
