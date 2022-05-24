import { expect } from 'chai';
import { SearchNeighborhoods } from '../../../../src/domain/model/search-neighborhoods.model';

describe('SearchNeighborhoods', () => {
  it('should instance SearchNeighborhoods and return the object with the correct properties', async () => {
    const model = new SearchNeighborhoods('brasil', 'sc', 'praia grande');

    expect(model.country).to.be.equal('brasil');
    expect(model.state).to.be.equal('sc');
    expect(model.city).to.be.equal('praia grande');
  });
});
