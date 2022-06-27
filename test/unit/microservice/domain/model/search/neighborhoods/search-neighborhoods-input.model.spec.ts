import { expect } from 'chai';
import { SearchNeighborhoodsDTO } from '../../../../../../../src/microservice/domain/model/search/neighborhoods/search-neighborhoods-dto.model';

describe('SearchNeighborhoodsInput', () => {
  it('should instance SearchNeighborhoodsInput and return the object with the correct properties', async () => {
    const model = new SearchNeighborhoodsDTO('brasil', 'sc', 'praia grande');

    expect(model.country).to.be.equal('brasil');
    expect(model.state).to.be.equal('sc');
    expect(model.city).to.be.equal('praia grande');
  });

  it('should instance SearchNeighborhoodsInput, setName and return the object with the correct properties', async () => {
    const model = new SearchNeighborhoodsDTO('brasil', 'sc', 'praia grande');
    model.setName('Vila Rosa');

    expect(model.country).to.be.equal('brasil');
    expect(model.state).to.be.equal('sc');
    expect(model.city).to.be.equal('praia grande');
    expect(model.name).to.be.equal('Vila Rosa');
  });
});
