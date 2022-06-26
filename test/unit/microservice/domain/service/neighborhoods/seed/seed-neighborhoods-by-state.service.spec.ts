import { Test, TestingModule } from '@nestjs/testing';
import { SeedNeighborhoodsByStateService } from '../../../../../../../src/microservice/domain/service/neighborhoods/seed/seed-neighborhoods-by-state.service';
import { expect } from 'chai';
import * as sinon from 'sinon';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { SearchNeighborhoodsInput } from '../../../../../../../src/microservice/domain/model/search/search-neighborhoods-input.model';
import { Country } from '../../../../../../../src/microservice/domain/schemas/country.schema';
import { City } from '../../../../../../../src/microservice/domain/schemas/city.schema';
import { GetCitiesByStateService } from '../../../../../../../src/microservice/domain/service/cities/get-cities-by-state.service';
import { GetNeighborhoodsByCityService } from '../../../../../../../src/microservice/domain/service/neighborhoods/get/get-neighborhoods-by-city.service';
import { LogSeedJobService } from '../../../../../../../src/microservice/domain/service/logseed/log-seed-job.service';
import { State } from '../../../../../../../src/microservice/domain/schemas/state.schema';
import { ValidateInputParamsService } from '../../../../../../../src/microservice/domain/service/validate-input-params.service';
import { NeighborhoodsMongoose } from '../../../../../../../src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { Translations } from '../../../../../../../src/microservice/domain/model/translations.model';
import { EnumTranslations } from '../../../../../../../src/microservice/domain/enumerators/enum-translations.enumerator';
import { NotFoundException } from '../../../../../../../src/core/error-handling/exception/not-found.exception';
import { GetNeighborhoodsByStateService } from '../../../../../../../src/microservice/domain/service/neighborhoods/get/get-neighborhoods-by-state.service';

describe('SeedNeighborhoodsByStateService', () => {
  let sut: SeedNeighborhoodsByStateService;

  const mockGetCitiesByStateService = {
    getCitiesByState: () => {
      return;
    }
  };

  const mockGetNeighborhoodsByStateService = {
    groupByCity: () => {
      return;
    }
  };

  const mockGetNeighborhoodsService = {
    searchByPuppeterAndSave: () => {
      return;
    }
  };

  const mockLogSeedService = {
    logSeedByState: () => {
      return;
    }
  };

  const mockNeighborhoodsMongooseRepository = {
    findBySearchParams: () => {
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

  const mockCities = () => {
    const city1 = new City();
    city1.id = 1;
    city1.name = 'Orleans';

    const city2 = new City();
    city2.id = 2;
    city2.name = 'Bom Jardim';

    return [city1, city2];
  };

  const country = new Country();
  country.id = 31;
  country.name = 'Brazil';
  country.translations = new Translations();
  country.translations[EnumTranslations.BR] = 'brasil';
  const state = new State();
  state.id = 2014;
  state.name = 'Santa Catarina';
  state.stateCode = 'SC';
  const city = new City();
  city.id = 1;
  city.name = 'Orleans';

  const mockConvertedSearch = () => {
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
      city: 'Bom Jardim'
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
        {
          provide: GetCitiesByStateService,
          useValue: mockGetCitiesByStateService
        },
        {
          provide: GetNeighborhoodsByCityService,
          useValue: mockGetNeighborhoodsService
        },
        {
          provide: LogSeedJobService,
          useValue: mockLogSeedService
        },
        {
          provide: GetNeighborhoodsByStateService,
          useValue: mockGetNeighborhoodsByStateService
        },
        SeedNeighborhoodsByStateService
      ]
    }).compile();

    sut = app.get<SeedNeighborhoodsByStateService>(
      SeedNeighborhoodsByStateService
    );
  });

  describe('seedNeighborhoodsByStateService', () => {
    it('should call seedNeighborhoodsByStateService and return "Seeded"', async () => {
      const groupByCityStub = sinon
        .stub(mockGetNeighborhoodsByStateService, 'groupByCity')
        .returns([]);

      const validateStub = sinon
        .stub(mockValidateService, 'validateAndConvertSearchByState')
        .returns(mockConvertedSearch());

      const getCitiesByStateStub = sinon
        .stub(mockGetCitiesByStateService, 'getCitiesByState')
        .returns(mockCities());

      const searchParams = new SearchNeighborhoodsInput('brasil', 'sc');

      const actual = await sut.seedNeighborhoodsByState(searchParams);

      expect(actual.success).to.be.equal(true);
      expect(actual.response).to.be.equal('Seeded');

      groupByCityStub.restore();
      validateStub.restore();
      getCitiesByStateStub.restore();
    });

    it('should call seedNeighborhoodsByStateService and return "Nothing to seed"', async () => {
      const groupByCityStub = sinon
        .stub(mockGetNeighborhoodsByStateService, 'groupByCity')
        .returns([]);

      const validateStub = sinon
        .stub(mockValidateService, 'validateAndConvertSearchByState')
        .returns(mockConvertedSearch());

      const getCitiesByStateStub = sinon
        .stub(mockGetCitiesByStateService, 'getCitiesByState')
        .returns([]);

      const searchParams = new SearchNeighborhoodsInput('brasil', 'sc');

      const actual = await sut.seedNeighborhoodsByState(searchParams);

      expect(actual.success).to.be.equal(true);
      expect(actual.response).to.be.equal('Nothing to seed');

      groupByCityStub.restore();
      validateStub.restore();
      getCitiesByStateStub.restore();
    });

    it('should call seedNeighborhoodsByStateService with error and call logSeedService', async () => {
      const groupByCityStub = sinon
        .stub(mockGetNeighborhoodsByStateService, 'groupByCity')
        .returns([]);

      const validateStub = sinon
        .stub(mockValidateService, 'validateAndConvertSearchByState')
        .returns(mockConvertedSearch());

      const getCitiesByStateStub = sinon
        .stub(mockGetCitiesByStateService, 'getCitiesByState')
        .returns(mockCities());

      const mockError = new NotFoundException('Neighborhoods');

      const searchByPuppeterAndSaveStub = sinon
        .stub(mockGetNeighborhoodsService, 'searchByPuppeterAndSave')
        .throws(mockError);

      const logSeedServiceStub = sinon.stub(
        mockLogSeedService,
        'logSeedByState'
      );

      const searchParams = new SearchNeighborhoodsInput('brasil', 'sc');

      await sut.seedNeighborhoodsByState(searchParams);

      sinon.assert.calledWithExactly(
        logSeedServiceStub,
        country,
        state,
        city,
        mockError
      );

      sinon.assert.calledWithExactly(
        logSeedServiceStub,
        country,
        state,
        city,
        mockError
      );

      groupByCityStub.restore();
      validateStub.restore();
      getCitiesByStateStub.restore();
      searchByPuppeterAndSaveStub.restore();
      logSeedServiceStub.restore();
    });
  });

  describe('seedByCity', () => {
    it('should call seedByCity and call searchByPuppeterAndSave with the correct params', async () => {
      const searchByPuppeterAndSaveStub = sinon
        .stub(mockGetNeighborhoodsService, 'searchByPuppeterAndSave')
        .returns(null);

      const mockCity = new City();
      mockCity.name = 'Orleans';
      mockCity.id = 1;

      await sut.seedByCity(mockConvertedSearch(), mockCity);

      const spySearch = new SearchNeighborhoodsInput('brasil', 'SC', 'Orleans');
      const spyConvertedSearch = mockConvertedSearch();
      spyConvertedSearch.city = mockCity;

      sinon.assert.calledOnceWithExactly(
        searchByPuppeterAndSaveStub,
        spySearch,
        spyConvertedSearch
      );

      searchByPuppeterAndSaveStub.restore();
    });
  });

  describe('getSeededCities', () => {
    it('should call getSeededCities and return the correct values', async () => {
      const groupByCityStub = sinon
        .stub(mockGetNeighborhoodsByStateService, 'groupByCity')
        .resolves(mockAggregatedCities);

      const actual = await sut.getSeededCities(1);

      expect(actual.length).to.be.equal(2);
      expect(actual[0]).to.be.equal(1);
      expect(actual[1]).to.be.equal(2);

      groupByCityStub.restore();
    });
  });
});
