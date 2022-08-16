import { Test, TestingModule } from '@nestjs/testing';
import { GetNeighborhoodsByCityService } from '../../../../../../../src/microservice/domain/service/neighborhoods/get/get-neighborhoods-by-city.service';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { NeighborhoodByCity } from '../../../../../../../src/microservice/domain/model/neighborhoods/neighborhood-by-city.model';
import { NeighborhoodsMongoose } from '../../../../../../../src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { Neighborhood } from '../../../../../../../src/microservice/domain/schemas/neighborhood.schema';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { CountriesMongoose } from '../../../../../../../src/microservice/adapter/repository/countries/countries-mongoose.repository';
import { CitiesMongoose } from '../../../../../../../src/microservice/adapter/repository/cities/cities-mongoose.repository';
import { StatesMongoose } from '../../../../../../../src/microservice/adapter/repository/states/states-mongoose.repository';
import { SearchNeighborhoodsDTO } from '../../../../../../../src/microservice/domain/model/search/neighborhoods/search-neighborhoods-dto.model';
import { ValidateInputParamsService } from '../../../../../../../src/microservice/domain/service/validate/validate-input-params.service';
import { Country } from '../../../../../../../src/microservice/domain/schemas/country.schema';
import { State } from '../../../../../../../src/microservice/domain/schemas/state.schema';
import { City } from '../../../../../../../src/microservice/domain/schemas/city.schema';
import { SeedNeighborhoodsByCityService } from '../../../../../../../src/microservice/domain/service/seed/neighborhoods/seed-neighborhoods-by-city.service';

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

  const mockMongoNeighborhoods = () => {
    const arr = [];
    const item1 = new Neighborhood();
    arr.push(item1);
    return arr;
  };

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
        GetNeighborhoodsByCityService
      ]
    }).compile();

    sut = app.get<GetNeighborhoodsByCityService>(GetNeighborhoodsByCityService);
  });

  describe('GetNeighborhoodsByCityService', () => {
    it('should call getNeighborhoodsByCity and return an array by puppeteer', async () => {
      const seedStub = sinon
        .stub(mockSeedByCityService, 'searchByPuppeterAndSave')
        .returns(mockNeighborhoods);

      const validateStub = sinon
        .stub(mockValidateService, 'validateAndConvertSearchByCity')
        .returns(mockConvertedSearch());

      const searchParams = new SearchNeighborhoodsDTO(
        'brasil',
        'sc',
        'orleans'
      );

      const actual = await sut.getNeighborhoodsByCity(searchParams);

      expect(actual).to.be.an('array');
      expect(actual.length).to.be.equal(2);

      seedStub.restore();
      validateStub.restore();
    });

    it('should call getNeighborhoodsByCity and return an array by mongodb', async () => {
      const mongoFindStub = sinon
        .stub(sut, 'findInDatabase')
        .returns(mockMongoNeighborhoods());

      const validateStub = sinon
        .stub(mockValidateService, 'validateAndConvertSearchByCity')
        .returns(mockConvertedSearch());

      const searchParams = new SearchNeighborhoodsDTO(
        'Brazil',
        'SC',
        'Orleans'
      );

      const actual = await sut.getNeighborhoodsByCity(searchParams);

      expect(JSON.stringify(actual)).to.be.equal(
        JSON.stringify(mockMongoNeighborhoods())
      );

      mongoFindStub.restore();
      validateStub.restore();
    });
  });
});
