import { expect } from 'chai';
import { CountryResponse } from '../../../../../../src/microservice/domain/model/countries/country-response.model';

describe('CountryResponse', () => {
  it('should instance CountryResponse and return the object with the correct properties', async () => {
    const model = new CountryResponse();
    model.name = 'Brazil';
    model.iso2 = 'BR';
    model.iso3 = 'BRA';

    expect(model.name).to.be.equal('Brazil');
    expect(model.iso3).to.be.equal('BRA');
    expect(model.iso2).to.be.equal('BR');
  });
});
