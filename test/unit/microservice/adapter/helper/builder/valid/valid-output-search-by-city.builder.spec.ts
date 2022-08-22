import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { Country } from '../../../../../../../src/microservice/domain/schemas/country.schema';
import { State } from '../../../../../../../src/microservice/domain/schemas/state.schema';
import { City } from '../../../../../../../src/microservice/domain/schemas/city.schema';
import { ValidOutputSearchByCityBuilder } from '../../../../../../../src/microservice/adapter/helper/builder/valid/valid-output-search-by-city.builder';
import { ReferenceNeighborhoodsByState } from '../../../../../../../src/microservice/domain/model/references/reference-neighborhoods-by-state.model';

const mockReference: ReferenceNeighborhoodsByState = {
  countryName: 'USA',
  countryId: 5,
  stateId: 3,
  stateName: 'New York',
  cityId: 1,
  cityName: 'New York City'
};

const mockConvertedSearch = () => {
  const mockCountry = new Country();
  mockCountry.id = 5;
  mockCountry.name = 'USA';
  const mockState = new State();
  mockState.id = 3;
  mockState.name = 'New York';
  const mockCity = new City();
  mockCity.id = 1;
  mockCity.name = 'New York City';
  return {
    country: mockCountry,
    state: mockState,
    city: mockCity
  };
};

describe('ValidOutputSearchByCityBuilder ', () => {
  it('Should instanciate ValidOutputSearchByCityBuilder and build correctly', function () {
    const nestBuilder = new ValidOutputSearchByCityBuilder(mockReference);
    const actual = nestBuilder.build();
    expect(JSON.stringify(actual)).to.be.equal(
      JSON.stringify(mockConvertedSearch())
    );
  });
});
