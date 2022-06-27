import { expect } from 'chai';
import { StatesByCountry } from '../../../../../../src/microservice/domain/model/states/states-by-country.model';

describe('StatesByCountry', () => {
  it('should instance StatesByCountry and return the object with the correct properties', async () => {
    const model = new StatesByCountry();
    model.name = 'Rio Grande do Sul';
    model.stateCode = 'RS';

    expect(model.name).to.be.equal('Rio Grande do Sul');
    expect(model.stateCode).to.be.equal('RS');
  });
});
