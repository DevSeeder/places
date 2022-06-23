import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ExtensionsModule } from '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { NeighborhoodsMongoose } from '../../../../../../src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Neighborhood } from '../../../../../../src/microservice/domain/schemas/neighborhood.schema';
import { mockModelMongoose } from '../../../../../mock/mongoose/mock-mongoose';
import { MongoDBException } from '../../../../../../src/core/error-handling/exception/mongodb-.exception';
import { SearchNeighborhoodsDB } from '../../../../../../src/microservice/domain/model/search/search-neighborhoods-db.model';

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

  const mockFindNeighborhoods = {
    select: jest.fn(() => {
      return {
        lean: jest.fn(() => {
          return {
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
});
