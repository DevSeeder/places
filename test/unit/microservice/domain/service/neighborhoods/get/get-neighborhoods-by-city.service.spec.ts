import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { NeighborhoodByCity } from '../../../../../../../src/microservice/domain/model/neighborhoods/neighborhood-by-city.model';
import { NeighborhoodsMongoose } from '../../../../../../../src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { CountriesMongoose } from '../../../../../../../src/microservice/adapter/repository/countries/countries-mongoose.repository';
import { CitiesMongoose } from '../../../../../../../src/microservice/adapter/repository/cities/cities-mongoose.repository';
import { StatesMongoose } from '../../../../../../../src/microservice/adapter/repository/states/states-mongoose.repository';
import { ValidateInputParamsService } from '../../../../../../../src/microservice/domain/service/validate/validate-input-params.service';
import { Country } from '../../../../../../../src/microservice/domain/schemas/country.schema';
import { State } from '../../../../../../../src/microservice/domain/schemas/state.schema';
import { City } from '../../../../../../../src/microservice/domain/schemas/city.schema';
import { SeedNeighborhoodsByCityService } from '../../../../../../../src/microservice/domain/service/seed/neighborhoods/seed-neighborhoods-by-city.service';
import { GetNeighborhoodsByCityService } from '../../../../../../../src/microservice/domain/service/neighborhoods/get/get-neighborhoods-by-city.service';
import { mockGetNeighborhoodsByCityService } from '../../../../../../mock/services/neighborhoods/get-neighborhoods-service.mock';
import { SearchNeighborhoodsDB } from '../../../../../../../src/microservice/domain/model/search/neighborhoods/search-neighborhoods-db.model';
import { Neighborhood } from '../../../../../../../src/microservice/domain/schemas/neighborhood.schema';

describe('GetNeighborhoodsByCityService', () => {
  let sut: GetNeighborhoodsByCityService;

  const mockNeighborhoodsMongooseRepository = {
    findBySearchParams: () => {
      return [];
    }
  };

  const mockPlacesMongooseRepository = {
    findByNameOrAlias: () => {
      return [];
    }
  };

  const mockSeedByCityService = {
    searchByPuppeterAndSave: () => {
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

  const mockResponse = [
    {
      name: 'Aires Rodrigues',
      cityId: 1,
      city: 'Orleans - SC - SANTA CATARINA',
      stateId: 2014,
      countryId: 31
    },
    {
      name: 'Alto Paraná',
      cityId: 2,
      city: 'Orleans - SC - SANTA CATARINA',
      stateId: 2014,
      countryId: 31
    }
  ];

  const mockNeighborhoods: NeighborhoodByCity[] = [
    {
      name: 'Aires Rodrigues',
      city: 'Orleans - SC',
      countryId: 31,
      stateId: 2014,
      cityId: 1
    },
    {
      name: 'Alto Paraná',
      city: 'Orleans - SC',
      countryId: 31,
      stateId: 2014,
      cityId: 2
    }
  ];

  const mockArrNeighborhoods: Partial<Neighborhood>[] = [
    {
      name: 'Aires Rodrigues',
      city: 'Orleans - SC',
      state: 'Santa Catarina',
      countryId: 31,
      stateId: 2014,
      cityId: 1
    },
    {
      name: 'Alto Paraná',
      city: 'Orleans - SC',
      state: 'Santa Catarina',
      countryId: 31,
      stateId: 2014,
      cityId: 2
    }
  ];

  const mockConvertedSearch = () => {
    const country = new Country();
    country.id = 31;
    country.name = 'Brazil';
    const state = new State();
    state.id = 2014;
    state.name = 'Santa Catarina';
    state.stateCode = 'SC';
    const city = new City();
    city.id = 1;
    city.name = 'Orleans';
    return { country, city, state };
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
          provide: CountriesMongoose,
          useValue: mockPlacesMongooseRepository
        },
        {
          provide: StatesMongoose,
          useValue: mockPlacesMongooseRepository
        },
        {
          provide: CitiesMongoose,
          useValue: mockPlacesMongooseRepository
        },
        {
          provide: ValidateInputParamsService,
          useFactory: () => mockValidateService
        },
        {
          provide: SeedNeighborhoodsByCityService,
          useValue: mockSeedByCityService
        },
        {
          provide: GetNeighborhoodsByCityService,
          useValue: mockGetNeighborhoodsByCityService
        },
        GetNeighborhoodsByCityService
      ]
    }).compile();

    sut = app.get<GetNeighborhoodsByCityService>(GetNeighborhoodsByCityService);
  });

  describe('searchInDatabase', () => {
    it('should call searchInDatabase and return an array', async () => {
      const mongoFindStub = sinon
        .stub(sut, 'findInDatabase')
        .returns(mockNeighborhoods);

      const actual = await sut.searchInDatabase(mockConvertedSearch());

      expect(JSON.stringify(actual)).to.be.equal(
        JSON.stringify(mockNeighborhoods)
      );

      mongoFindStub.restore();
    });
  });

  describe('findInDatabase', () => {
    it('should call findInDatabase with name param and return an array', async () => {
      const mongoFindStub = sinon
        .stub(mockNeighborhoodsMongooseRepository, 'findBySearchParams')
        .returns(mockArrNeighborhoods);
      const search = new SearchNeighborhoodsDB(1, 1, 1);
      search.name = 'any';
      const actual = await sut.findInDatabase(search);

      expect(JSON.stringify(actual)).to.be.equal(JSON.stringify(mockResponse));

      mongoFindStub.restore();
    });
  });
});
