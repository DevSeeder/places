import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { NeighborhoodsMongoose } from '../../../../../../../src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { Neighborhood } from '../../../../../../../src/microservice/domain/schemas/neighborhood.schema';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { SearchNeighborhoodsInput } from '../../../../../../../src/microservice/domain/model/search/neighborhoods/search-neighborhoods-input.model';
import { ValidateInputParamsService } from '../../../../../../../src/microservice/domain/service/validate/validate-input-params.service';
import { Country } from '../../../../../../../src/microservice/domain/schemas/country.schema';
import { State } from '../../../../../../../src/microservice/domain/schemas/state.schema';
import { City } from '../../../../../../../src/microservice/domain/schemas/city.schema';
import { GetNeighborhoodsByStateService } from '../../../../../../../src/microservice/domain/service/neighborhoods/get/get-neighborhoods-by-state.service';

describe('GetNeighborhoodsByStateService', () => {
  let sut: GetNeighborhoodsByStateService;

  const mockNeighborhoodsMongooseRepository = {
    findBySearchParams: () => {
      return [];
    },
    groupBy: () => {
      return [];
    }
  };

  const mockValidateService = {
    validateAndConvertSearchByState: () => {
      return {};
    },
    validateAndConvertSearchByCity: () => {
      return {};
    }
  };

  const mockMongoNeighborhoods = () => {
    const arr = [];
    const item1 = new Neighborhood();
    item1.id = 1;
    item1.name = 'any';
    arr.push(item1);
    return arr;
  };

  const mockConvertedSearch = () => {
    const country = new Country();
    country.id = 31;
    country.name = 'Brazil';
    const state = new State();
    state.id = 2014;
    state.name = 'Santa Catarina';
    state.stateCode = 'SC';
    const city = new City();
    return { country, city, state };
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

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: NeighborhoodsMongoose,
          useValue: mockNeighborhoodsMongooseRepository
        },
        {
          provide: ValidateInputParamsService,
          useFactory: () => mockValidateService
        },
        GetNeighborhoodsByStateService
      ]
    }).compile();

    sut = app.get<GetNeighborhoodsByStateService>(
      GetNeighborhoodsByStateService
    );
  });

  describe('getNeighborhoodsByState', () => {
    it('should call getNeighborhoodsByState and return an array by puppeteer', async () => {
      const validateStub = sinon
        .stub(mockValidateService, 'validateAndConvertSearchByState')
        .returns(mockConvertedSearch());

      const findInDatabaseStub = sinon
        .stub(sut, 'findInDatabase')
        .returns(mockMongoNeighborhoods());

      const groupByStub = sinon
        .stub(sut, 'groupByCity')
        .returns(mockAggregatedCities);

      const searchParams = new SearchNeighborhoodsInput('brasil', 'sc');

      const actual = await sut.getNeighborhoodsByState(searchParams);

      expect(actual.Orleans).to.be.an('array');
      expect(actual.Orleans.length).to.be.equal(1);
      expect(actual['Braço do Norte']).to.be.an('array');
      expect(actual['Braço do Norte'].length).to.be.equal(1);

      findInDatabaseStub.restore();
      validateStub.restore();
      groupByStub.restore();
    });
  });

  describe('groupByCity', () => {
    it('should call groupByCity and return an array by puppeteer', async () => {
      const groupByStub = sinon
        .stub(mockNeighborhoodsMongooseRepository, 'groupBy')
        .returns(mockAggregatedCities);

      const actual = await sut.groupByCity(1);

      expect(actual).to.be.equal(mockAggregatedCities);

      groupByStub.restore();
    });
  });
});
