import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ExtensionsModule } from '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { getModelToken } from '@nestjs/mongoose';
import { mockModelMongoose } from '../../../../../mock/mongoose/mock-mongoose';
import { CitiesMongoose } from '../../../../../../src/microservice/adapter/repository/cities/cities-mongoose.repository';
import { City } from '../../../../../../src/microservice/domain/schemas/city.schema';

jest.useFakeTimers();
jest.setTimeout(20000);

describe('CitiesMongoose', () => {
  let sut: CitiesMongoose;
  let app: TestingModule;

  const mockCities = () => {
    const arr = [];
    const item1 = new City();
    item1.name = 'Orleans';
    arr.push(item1);

    return arr;
  };

  const mockFind = {
    lean: jest.fn(() => {
      return {
        exec: jest.fn(() => mockCities())
      };
    }),
    select: jest.fn(() => {
      return {
        lean: jest.fn(() => {
          return {
            exec: jest.fn(() => mockCities())
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
        CitiesMongoose,
        {
          provide: getModelToken(City.name),
          useValue: mockModelMongoose
        }
      ]
    }).compile();

    sut = app.get<CitiesMongoose>(CitiesMongoose);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('findByNameOrAliasOrId', () => {
    it('should call findByNameOrAliasOrId and return an array', async () => {
      const findManyStub = sinon
        .stub(mockModelMongoose, 'find')
        .returns(mockFind);

      const actual = await sut.findByNameOrAliasOrId('any');

      expect(actual).to.be.an('array').that.is.not.empty;

      findManyStub.restore();
    });
  });
});
