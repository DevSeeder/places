import { expect } from 'chai';
import { CitiesByCountry } from '../../../../../../src/microservice/domain/model/cities/cities-by-country.model';

describe('CitiesByCountry', () => {
  it('should instance CitiesByCountry and return the object with the correct properties', async () => {
    const model = new CitiesByCountry();
    model.name = 'Torres';
    model.stateCode = 'RS';

    expect(model.name).to.be.equal('Torres');
    expect(model.stateCode).to.be.equal('RS');
  });
});
