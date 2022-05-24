import { expect } from 'chai';
import { NeighborhoodsByCity } from '../../../../src/domain/model/neighborhoods-by-city.model';

describe('NeighborhoodsByCity', () => {
  it('should instance NeighborhoodsByCity and return the object with the correct properties', async () => {
    const model = new NeighborhoodsByCity();
    model.city = 'Torres-RS';
    model.name = 'Rio Verde';

    expect(model.city).to.be.equal('Torres-RS');
    expect(model.name).to.be.equal('Rio Verde');
  });
});
