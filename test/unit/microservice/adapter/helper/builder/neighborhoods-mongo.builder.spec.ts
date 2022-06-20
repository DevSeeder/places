import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { NeighborhoodsMongoBuilder } from '../../../../../../src/microservice/adapter/helper/builder/neighborhoods-mongo.builder';
import { SearchNeighborhoods } from '../../../../../../src/microservice/domain/model/search/search-neighborhoods.model';
import { Neighborhood } from '../../../../../../src/microservice/domain/schemas/neighborhood.schema';

const mockNeighborhoodsByCity = [
  {
    name: 'Harlem',
    city: 'New York City - NY'
  },
  {
    name: `Hell's Kitchen`,
    city: 'New York City - NY'
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

describe('NeighborhoodsMongoBuilder ', () => {
  it('Should instanciate NeighborhoodsMongoBuilder and build correctly', function () {
    const nestBuilder = new NeighborhoodsMongoBuilder(mockNeighborhoodsByCity);
    const mockSearch = new SearchNeighborhoods('USA', 'NY', 'New York City');
    const actual = nestBuilder.build(mockSearch);
    expect(JSON.stringify(actual)).to.be.equal(
      JSON.stringify(mockMongoNeighborhoods())
    );
  });
});
