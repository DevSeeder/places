import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { NeighborhoodsMongoBuilder } from '../../../../../../../src/microservice/adapter/helper/builder/neighborhoods/neighborhoods-mongo.builder';
import { Neighborhood } from '../../../../../../../src/microservice/domain/schemas/neighborhood.schema';
import { Country } from '../../../../../../../src/microservice/domain/schemas/country.schema';
import { State } from '../../../../../../../src/microservice/domain/schemas/state.schema';
import { City } from '../../../../../../../src/microservice/domain/schemas/city.schema';
import { NeighborhoodByCity } from '../../../../../../../src/microservice/domain/model/neighborhoods/neighborhood-by-city.model';

const mockNeighborhoods: NeighborhoodByCity[] = [
  {
    name: 'Harlem',
    city: 'New York City - NY',
    countryId: 31,
    stateId: 41,
    cityId: 3
  },
  {
    name: `Hell's Kitchen`,
    city: 'New York City - NY',
    countryId: 31,
    stateId: 41,
    cityId: 4
  }
];

const mockMongoNeighborhoods = () => {
  const arr = [];
  const item1 = new Neighborhood();
  item1.country = 'USA';
  item1.state = 'NY';
  item1.city = 'New York City';
  item1.name = 'Harlem';
  arr.push(item1);

  const item2 = new Neighborhood();
  item2.country = 'USA';
  item2.state = 'NY';
  item2.city = 'New York City';
  item2.name = `Hell's Kitchen`;
  arr.push(item2);

  return arr;
};

const mockConvertedSearch = () => {
  const mockCountry = new Country();
  mockCountry.name = 'USA';
  const mockState = new State();
  mockState.name = 'New York';
  mockState.stateCode = 'NY';
  const mockCity = new City();
  mockCity.name = 'New York City';
  return {
    country: mockCountry,
    state: mockState,
    city: mockCity
  };
};

describe('NeighborhoodsMongoBuilder ', () => {
  it('Should instanciate NeighborhoodsMongoBuilder and build correctly', function () {
    const nestBuilder = new NeighborhoodsMongoBuilder(mockNeighborhoods);
    const actual = nestBuilder.build(mockConvertedSearch());
    expect(JSON.stringify(actual)).to.be.equal(
      JSON.stringify(mockMongoNeighborhoods())
    );
  });
});
