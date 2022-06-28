import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { NeighborhoodsMongoose } from '../../../../../../../src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { ValidateInputParamsService } from '../../../../../../../src/microservice/domain/service/validate/validate-input-params.service';
import { City } from '../../../../../../../src/microservice/domain/schemas/city.schema';
import { GetCitiesByStateService } from '../../../../../../../src/microservice/domain/service/cities/get/get-cities-by-state.service';
import { SearchCitiesDB } from '../../../../../../../src/microservice/domain/model/search/cities/search-cities-db.model';
import { CitiesMongoose } from '../../../../../../../src/microservice/adapter/repository/cities/cities-mongoose.repository';
import { SearchCitiesDTO } from '../../../../../../../src/microservice/domain/model/search/cities/search-cities-dto.model';
import { State } from '../../../../../../../src/microservice/domain/schemas/state.schema';
import { Country } from '../../../../../../../src/microservice/domain/schemas/country.schema';

describe('GetCitiesByStateService', () => {
  let sut: GetCitiesByStateService;

  const mockNeighborhoodsMongooseRepository = {
    findBySearchParams: () => {
      return [];
    },

    groupBy: () => {
      return [];
    }
  };

  const mockCitiesMongooseRepository = {
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

  const mockConvertedSearch = () => {
    const mockCountry = new Country();
    mockCountry.name = 'USA';
    const mockState = new State();
    mockState.name = 'New York';
    mockState.stateCode = 'NY';
    return {
      country: mockCountry,
      state: mockState
    };
  };

  const mockCities = () => {
    const city1 = new City();
    city1.name = 'any';

    const city2 = new City();
    city2.name = 'any';
    return [city1, city2];
  };

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
          provide: CitiesMongoose,
          useValue: mockCitiesMongooseRepository
        },
        {
          provide: ValidateInputParamsService,
          useFactory: () => mockValidateService
        },
        GetCitiesByStateService
      ]
    }).compile();

    sut = app.get<GetCitiesByStateService>(GetCitiesByStateService);
  });

  describe('findCitiesByState', () => {
    it('should call findCitiesByState and return an array by puppeteer', async () => {
      const arrMockCities = mockCities();
      const groupByStub = sinon
        .stub(mockCitiesMongooseRepository, 'findBySearchParams')
        .returns(arrMockCities);

      const searchParams = new SearchCitiesDB(1, 2);

      const arrIgnore = [3, 4, 5];

      const actual = await sut.findCitiesByState(searchParams, arrIgnore);

      expect(actual).to.be.equal(arrMockCities);

      groupByStub.restore();
    });

    it('should call findCitiesByState and return an array by puppeteer', async () => {
      const arrMockCities = mockCities();
      const groupByStub = sinon
        .stub(mockCitiesMongooseRepository, 'findBySearchParams')
        .returns(arrMockCities);

      const searchParams = new SearchCitiesDB(1, 2);

      const actual = await sut.findCitiesByState(searchParams);

      expect(actual).to.be.equal(arrMockCities);

      groupByStub.restore();
    });
  });

  describe('getCitiesByState', () => {
    it('should call getCitiesByState and return an array', async () => {
      const arrMockCities = mockCities();
      const groupByStub = sinon
        .stub(mockCitiesMongooseRepository, 'findBySearchParams')
        .returns(arrMockCities);

      const convertedSearchStub = sinon
        .stub(mockValidateService, 'validateAndConvertSearchByState')
        .returns(mockConvertedSearch());

      const searchParams = new SearchCitiesDTO('Brazil', 'SC');

      const actual = await sut.getCitiesByState(searchParams);

      expect(actual).to.be.equal(arrMockCities);

      groupByStub.restore();
      convertedSearchStub.restore();
    });
  });
});
