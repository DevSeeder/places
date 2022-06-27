import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ExtensionsModule } from '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { CountriesMongoose } from '../../../../../../src/microservice/adapter/repository/countries/countries-mongoose.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Neighborhood } from '../../../../../../src/microservice/domain/schemas/neighborhood.schema';
import { mockModelMongoose } from '../../../../../mock/mongoose/mock-mongoose';
import { Country } from '../../../../../../src/microservice/domain/schemas/country.schema';

jest.useFakeTimers();
jest.setTimeout(20000);

describe('CountriesMongoose', () => {
  let sut: CountriesMongoose;
  let app: TestingModule;

  const mockCountries = () => {
    const arr = [];
    const item1 = new Neighborhood();
    item1.country = 'USA';
    item1.state = 'NJ';
    item1.city = 'Gotham City';
    item1.name = 'Brideshead';
    arr.push(item1);

    return arr;
  };

  const mockFindCountries = {
    lean: jest.fn(() => {
      return {
        exec: jest.fn(() => mockCountries())
      };
    })
  };

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [ExtensionsModule],
      controllers: [],
      providers: [
        CountriesMongoose,
        {
          provide: getModelToken(Country.name),
          useValue: mockModelMongoose
        }
      ]
    }).compile();

    sut = app.get<CountriesMongoose>(CountriesMongoose);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('findBySearchParams', () => {
    it('should call findBySearchParams and return an array', async () => {
      const findManyStub = sinon
        .stub(mockModelMongoose, 'find')
        .returns(mockFindCountries);

      const actual = await sut.findByNameOrAliasOrId('any');

      expect(actual).to.be.an('array').that.is.not.empty;

      findManyStub.restore();
    });
  });
});
