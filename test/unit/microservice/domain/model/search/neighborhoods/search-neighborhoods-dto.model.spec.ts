import { expect } from 'chai';
import { SearchNeighborhoodsDTO } from '../../../../../../../src/microservice/domain/model/search/neighborhoods/search-neighborhoods-dto.model';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';

describe('SearchNeighborhoodsDTO', () => {
  it('should instance SearchNeighborhoodsDTO and return the object with the correct properties', async () => {
    const model = new SearchNeighborhoodsDTO('brasil', 'sc', 'praia grande');

    expect(model.country).to.be.equal('brasil');
    expect(model.state).to.be.equal('sc');
    expect(model.city).to.be.equal('praia grande');
  });

  it('should instance SearchNeighborhoodsDTO, setName and return the object with the correct properties', async () => {
    const model = new SearchNeighborhoodsDTO('brasil', 'sc', 'praia grande');
    model.setName('Vila Rosa');

    expect(model.country).to.be.equal('brasil');
    expect(model.state).to.be.equal('sc');
    expect(model.city).to.be.equal('praia grande');
    expect(model.name).to.be.equal('Vila Rosa');
  });

  it('should instance SearchNeighborhoodsDTOand throws invalid data exception', async () => {
    const model = new SearchNeighborhoodsDTO('', 'sc', 'praia grande');

    try {
      model.validateIsAnyEmptyKey();
    } catch (err) {
      expect(err.message).to.be.equal(`The property 'Country' cannot be empty`);
    }
  });
});
