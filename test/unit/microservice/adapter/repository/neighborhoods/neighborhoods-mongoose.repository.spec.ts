import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ExtensionsModule } from '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { NeighborhoodsMongoose } from '../../../../../../src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Neighborhood } from '../../../../../../src/microservice/domain/schemas/neighborhood.schema';
import { mockModelMongoose } from '../../../../../mock/mongoose/mock-mongoose';
import { MongoDBException } from '../../../../../../src/core/error-handling/exception/mongodb-.exception';
import { SearchNeighborhoodsDB } from '../../../../../../src/microservice/domain/model/search/neighborhoods/search-neighborhoods-db.model';

jest.useFakeTimers();
jest.setTimeout(20000);

describe('NeighborhoodsMongoose', () => {
  let sut: NeighborhoodsMongoose;
  let app: TestingModule;

  const mockNeighborhoods = () => {
    const arr = [];
    const item1 = new Neighborhood();
    item1.country = 'USA';
    item1.state = 'NJ';
    item1.city = 'Gotham City';
    item1.name = 'Brideshead';
    arr.push(item1);

    const item2 = new Neighborhood();
    item2.country = 'USA';
    item2.state = 'NJ';
    item2.city = 'Gotham City';
    item2.name = `Bristol Township`;
    arr.push(item2);

    return arr;
  };

  const mockAggregatedCities = [
    {
      _id: { cityId: 1 },
      count: 60,
      city: 'Orleans'
    },
    {
      _id: { cityId: 2 },
      count: 13,
      city: 'Braço do Norte'
    }
  ];

  const mockAggregatedCities2 = [
    {
      _id: { cityId: 1 },
      count: 60
    },
    {
      _id: { cityId: 2 },
      count: 13
    }
  ];

  const mockFindNeighborhoods = {
    sort: jest.fn(() => {
      return {
        select: jest.fn(() => {
          return {
            lean: jest.fn(() => {
              return {
                exec: jest.fn(() => mockNeighborhoods())
              };
            }),
            exec: jest.fn(() => mockNeighborhoods())
          };
        })
      };
    })
  };

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [ExtensionsModule],
      controllers: [],
      providers: [
        NeighborhoodsMongoose,
        {
          provide: getModelToken(Neighborhood.name),
          useValue: mockModelMongoose
        }
      ]
    }).compile();

    sut = app.get<NeighborhoodsMongoose>(NeighborhoodsMongoose);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('findBySearchParams', () => {
    it('should call findBySearchParams and return an array', async () => {
      const mockSearchParams = new SearchNeighborhoodsDB(1, 2, 3);

      const findManyStub = sinon
        .stub(mockModelMongoose, 'find')
        .returns(mockFindNeighborhoods);

      const actual = await sut.findBySearchParams(mockSearchParams);

      expect(actual).to.be.an('array').that.is.not.empty;

      findManyStub.restore();
    });
  });

  // describe('buildRegexFilterQuery', () => {
  //   it('should call buildRegexFilterQuery and return regex filter', async () => {
  //     const mockParams = {
  //       countryId: 1,
  //       stateId: 2,
  //       cityId: 3,
  //       name: 'any'
  //     };

  //     const mockRegex = {
  //       countryId: 1,
  //       stateId: 2,
  //       cityId: 3,
  //       name: new RegExp('any', 'i')
  //     };

  //     const actual = await sut.buildRegexFilterQuery(mockParams);

  //     expect(JSON.stringify(actual)).to.be.equal(JSON.stringify(mockRegex));
  //   });

  //   it('should call buildRegexFilterQuery and return regex filter with empty obj', async () => {
  //     const actual = await sut.buildRegexFilterQuery();
  //     expect(JSON.stringify(actual)).to.be.equal(JSON.stringify({}));
  //   });

  //   it('should call buildRegexFilterQuery with null param and return regex filter with empty obj', async () => {
  //     const actual = await sut.buildRegexFilterQuery({
  //       name: null
  //     });
  //     expect(JSON.stringify(actual)).to.be.equal(JSON.stringify({}));
  //   });
  // });

  describe('insertOne', () => {
    it('should call insertOne and call model.create with the correct params', async () => {
      const doc = new Neighborhood();

      const createStubMongo = sinon
        .stub(mockModelMongoose, 'create')
        .yields(null, () => {
          return;
        });

      const createStubSpy = sinon.spy(sut, 'create');

      await sut.insertOne(doc, 'any');

      sinon.assert.calledOnce(createStubMongo);
      sinon.assert.calledOnceWithExactly(createStubSpy, doc);

      createStubMongo.restore();
      createStubSpy.restore();
    });

    it('should call insertOne and call model.create and throws a errors', async () => {
      const doc = new Neighborhood();

      const createStubMongo = sinon
        .stub(mockModelMongoose, 'create')
        .yields(new MongoDBException('any', 4), () => {
          return;
        });

      try {
        await sut.insertOne(doc, 'any');
      } catch (err) {
        expect(err.message).to.be.equal('any');
      }

      createStubMongo.restore();
    });
  });

  // describe('buildSelectAggregated', () => {
  //   it('should call buildSelectAggregated with default params', async () => {
  //     const actual = sut.buildSelectAggregated();
  //     expect(JSON.stringify(actual)).to.be.equal('{}');
  //   });
  // });

  describe('groupBy', () => {
    const mockAggregatedParams = [
      { $match: { stateId: 2014 } },
      {
        $group: {
          _id: { cityId: '$cityId' },
          count: { $sum: 1 },
          city: { $first: '$city' }
        }
      }
    ];

    const mockAggregatedParamsDefaultParams = [
      {
        $group: {
          _id: { cityId: '$cityId' },
          count: { $sum: 1 }
        }
      }
    ];

    it('should call groupBy and return an array and call aggregate with the correct params', async () => {
      const mockGroup = { cityId: '$cityId' };

      const aggregateStub = sinon
        .stub(mockModelMongoose, 'aggregate')
        .returns(mockAggregatedCities);

      const match = { stateId: 2014 };
      const select = { city: 'city' };

      const actual = await sut.groupBy(mockGroup, match, select);

      expect(actual).to.be.an('array').that.is.not.empty;

      sinon.assert.calledOnceWithExactly(aggregateStub, mockAggregatedParams);

      aggregateStub.restore();
    });

    it('should call groupBy with default params and return an array and call aggregate with the correct params', async () => {
      const mockGroup = { cityId: '$cityId' };

      const aggregateStub = sinon
        .stub(mockModelMongoose, 'aggregate')
        .returns(mockAggregatedCities2);

      const actual = await sut.groupBy(mockGroup);

      expect(actual).to.be.an('array').that.is.not.empty;

      sinon.assert.calledOnceWithExactly(
        aggregateStub,
        mockAggregatedParamsDefaultParams
      );

      aggregateStub.restore();
    });
  });
});
