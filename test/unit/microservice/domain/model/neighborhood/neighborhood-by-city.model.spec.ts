import { expect } from 'chai';
import { NeighborhoodByCity } from '../../../../../../src/microservice/domain/model/neighborhoods/neighborhood-by-city.model';

describe('NeighborhoodByCity', () => {
  it('should instance NeighborhoodByCity and return the object with the correct properties', async () => {
    const model = new NeighborhoodByCity();
    model.city = 'Torres-RS';
    model.name = 'Rio Verde';

    expect(model.city).to.be.equal('Torres-RS');
    expect(model.name).to.be.equal('Rio Verde');
  });
});
