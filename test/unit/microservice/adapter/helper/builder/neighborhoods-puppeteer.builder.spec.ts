import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { NeighborhoodsPuppeteerBuilder } from '../../../../../../src/microservice/adapter/helper/builder/neighborhoods-puppeteer.builder';
import { Neighborhood } from '../../../../../../src/microservice/domain/schemas/neighborhood.schema';

const mockNeighborhoodsByCity = [
  {
    city: 'New York City - NY',
    name: 'Harlem'
  },
  {
    city: 'New York City - NY',
    name: `Hell's Kitchen`
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

describe('NeighborhoodsPuppeteerBuilder ', () => {
  it('Should instanciate NeighborhoodsPuppeteerBuilder and build correctly', function () {
    const nestBuilder = new NeighborhoodsPuppeteerBuilder(
      mockMongoNeighborhoods()
    );
    const actual = nestBuilder.build();
    expect(JSON.stringify(actual)).to.be.equal(
      JSON.stringify(mockNeighborhoodsByCity)
    );
  });
});
