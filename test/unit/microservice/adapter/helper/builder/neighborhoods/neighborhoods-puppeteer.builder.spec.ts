import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { Neighborhood } from '../../../../../../../src/microservice/domain/schemas/neighborhood.schema';
import { NeighborhoodsPuppeteerBuilder } from '../../../../../../../src/microservice/adapter/helper/builder/neighborhoods/neighborhoods-puppeteer.builder';
import { NeighborhoodByCity } from '../../../../../../../src/microservice/domain/model/neighborhoods/neighborhood-by-city.model';

const mockNeighborhoods: NeighborhoodByCity[] = [
  {
    name: 'Harlem',
    cityId: 3,
    city: 'New York City - NY',
    stateId: 41,
    countryId: 1
  },
  {
    name: `Hell's Kitchen`,
    cityId: 4,
    city: 'New York City - NY',
    stateId: 41,
    countryId: 1
  }
];

const mockMongoNeighborhoods = () => {
  const arr = [];
  const item1 = new Neighborhood();
  item1.country = 'USA';
  item1.state = 'NY';
  item1.city = 'New York City';
  item1.countryId = 1;
  item1.stateId = 41;
  item1.cityId = 3;
  item1.name = 'Harlem';
  arr.push(item1);

  const item2 = new Neighborhood();
  item2.country = 'USA';
  item2.state = 'NY';
  item2.city = 'New York City';
  item2.countryId = 1;
  item2.stateId = 41;
  item2.cityId = 4;
  item2.name = `Hell's Kitchen`;
  arr.push(item2);

  return arr;
};

describe('NeighborhoodsPuppeteerBuilder ', () => {
  it('Should instanciate NeighborhoodsPuppeteerBuilder and build correctly', function () {
    const builder = new NeighborhoodsPuppeteerBuilder(mockMongoNeighborhoods());
    const actual = builder.build();
    expect(JSON.stringify(actual)).to.be.equal(
      JSON.stringify(mockNeighborhoods)
    );
  });
});
