import { expect } from 'chai';
import { SearchNeighborhoods } from '../../../../../../src/microservice/domain/model/search/search-neighborhoods.model';

describe('SearchNeighborhoods', () => {
  it('should instance SearchNeighborhoods and return the object with the correct properties', async () => {
    const model = new SearchNeighborhoods('brasil', 'sc', 'praia grande');

    expect(model.country).to.be.equal('brasil');
    expect(model.state).to.be.equal('sc');
    expect(model.city).to.be.equal('praia grande');
  });

  it('should instance SearchNeighborhoods, setName and return the object with the correct properties', async () => {
    const model = new SearchNeighborhoods('brasil', 'sc', 'praia grande');
    model.setName('Vila Rosa');

    expect(model.country).to.be.equal('brasil');
    expect(model.state).to.be.equal('sc');
    expect(model.city).to.be.equal('praia grande');
    expect(model.name).to.be.equal('Vila Rosa');
  });
});
