import { expect } from 'chai';
import { SearchRegionsDTO } from '../../../../../../../src/microservice/domain/model/search/regions/search-regions-dto.model';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';

describe('SearchRegionsDTO', () => {
  it('should instance SearchRegionsDTO and return the object with the correct properties', async () => {
    const model = new SearchRegionsDTO('brasil');

    expect(model.country).to.be.equal('brasil');
  });
});
