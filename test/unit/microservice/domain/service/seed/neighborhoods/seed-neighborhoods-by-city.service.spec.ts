import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { SearchNeighborhoodsDTO } from '../../../../../../../src/microservice/domain/model/search/neighborhoods/search-neighborhoods-dto.model';
import { City } from '../../../../../../../src/microservice/domain/schemas/city.schema';
import { LogSeedJobService } from '../../../../../../../src/microservice/domain/service/logseed/log-seed-job.service';
import { NeighborhoodsMongoose } from '../../../../../../../src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { SeedNeighborhoodsByCityService } from '../../../../../../../src/microservice/domain/service/seed/neighborhoods/seed-neighborhoods-by-city.service';
import { EnumTranslations } from '../../../../../../../src/microservice/domain/enumerators/enum-translations.enumerator';
import { Translations } from '../../../../../../../src/microservice/domain/model/translations.model';
import { Country } from '../../../../../../../src/microservice/domain/schemas/country.schema';
import { State } from '../../../../../../../src/microservice/domain/schemas/state.schema';
import { SaveNeighborhoodsByCityService } from '../../../../../../../src/microservice/domain/service/neighborhoods/save-neighborhoods-by-city.service';
import { NeighborhoodByCity } from '../../../../../../../src/microservice/domain/model/neighborhoods/neighborhood-by-city.model';
import { EventSeedByCityDTO } from '../../../../../../../src/microservice/domain/model/dto/events/event-seed-by-city-dto.model';
import { ReferenceEventByCityBuilder } from '../../../../../../../src/microservice/adapter/helper/builder/dto/reference/reference-event-by-city.builder';
import { ValidateInputParamsService } from '../../../../../../../src/microservice/domain/service/validate/validate-input-params.service';
import { mockValidateService } from '../../../../../../mock/services/validate/validate-service.mock';
import { PublishSeedNeighborhoodsByCityService } from '../../../../../../../src/microservice/domain/service/seed/neighborhoods/publish/publish-seed-neighborhoods-by-city.service';
import { mockPublishService } from '../../../../../../mock/services/seed/publish/publish-seed-service.mock';
import { DateHelper } from '../../../../../../../src/microservice/adapter/helper/date.helper';

describe('SeedNeighborhoodsByCityService', () => {
  let sut: SeedNeighborhoodsByCityService;

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

  const mockGuiaMaisRepository = {
    getElements: () => {
      return;
    }
  };

  const mockSaveNeighborhoodsService = {
    saveNeighborhoodsByCity: () => {
      return;
    },
    findNeighborhoodInDatabase: () => {
      return [];
    }
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
          provide: LogSeedJobService,
          useValue: mockLogSeedService
        },
        {
          provide: 'GuiaMaisRepository',
          useValue: mockGuiaMaisRepository
        },
        {
          provide: SaveNeighborhoodsByCityService,
          useFactory: () => mockSaveNeighborhoodsService
        },
        {
          provide: ValidateInputParamsService,
          useValue: mockValidateService
        },
        {
          provide: PublishSeedNeighborhoodsByCityService,
          useValue: mockPublishService
        },
        SeedNeighborhoodsByCityService
      ]
    }).compile();

    sut = app.get<SeedNeighborhoodsByCityService>(
      SeedNeighborhoodsByCityService
    );
  });

  describe('seedNeighborhoodsByCity', () => {
    it('should call seedNeighborhoodsByCity and call searchByPuppeterAndSave with the correct params', async () => {
      const searchByPuppeterAndSaveStub = sinon
        .stub(sut, 'searchByPuppeterAndSave')
        .returns(null);

      const publishSpy = sinon.stub(mockPublishService, 'publishSuccess');

      const validateStub = sinon
        .stub(mockValidateService, 'validateAndConvertSearchByCity')
        .returns(mockConvertedSearch());

      const mockCity = new City();
      mockCity.name = 'Orleans';
      mockCity.id = 1;

      const mockEP = new ReferenceEventByCityBuilder(
        mockConvertedSearch()
      ).build(mockCity);

      await sut.seedNeighborhoodsByCity(
        new EventSeedByCityDTO(DateHelper.getDateNow(), mockEP)
      );

      const spyConvertedSearch = mockConvertedSearch();
      spyConvertedSearch.city = mockCity;

      sinon.assert.calledOnceWithExactly(
        publishSpy,
        mockConvertedSearch(),
        null
      );

      searchByPuppeterAndSaveStub.restore();
      publishSpy.restore();
      validateStub.restore();
    });

    it('should call seedNeighborhoodsByCity with error and call publishError with the correct params', async () => {
      const mockErr = new Error('any');
      const searchByPuppeterAndSaveStub = sinon
        .stub(sut, 'searchByPuppeterAndSave')
        .throws(mockErr);

      const publishSpy = sinon.stub(mockPublishService, 'publishError');

      const validateStub = sinon
        .stub(mockValidateService, 'validateAndConvertSearchByCity')
        .returns(mockConvertedSearch());

      const mockCity = new City();
      mockCity.name = 'Orleans';
      mockCity.id = 1;

      const mockEP = new ReferenceEventByCityBuilder(
        mockConvertedSearch()
      ).build(mockCity);

      await sut.seedNeighborhoodsByCity(
        new EventSeedByCityDTO(DateHelper.getDateNow(), mockEP)
      );

      const spyConvertedSearch = mockConvertedSearch();
      spyConvertedSearch.city = mockCity;

      sinon.assert.calledOnceWithExactly(
        publishSpy,
        mockConvertedSearch(),
        mockErr
      );

      searchByPuppeterAndSaveStub.restore();
      publishSpy.restore();
      validateStub.restore();
    });

    it('should call seedNeighborhoodsByCity with ref error and call publishReferenceError with the correct params', async () => {
      const mockErr = new Error('any');
      const validateStub = sinon
        .stub(mockValidateService, 'validateAndConvertSearchByCity')
        .throws(mockErr);

      const searchByPuppeterAndSaveStub = sinon
        .stub(sut, 'searchByPuppeterAndSave')
        .returns(null);

      const publishSpy = sinon.spy(mockPublishService, 'publishRefenceError');

      const mockCity = new City();
      mockCity.name = 'Orleans';
      mockCity.id = 1;

      const mockEP = new ReferenceEventByCityBuilder(
        mockConvertedSearch()
      ).build(mockCity);

      const payload = new EventSeedByCityDTO(DateHelper.getDateNow(), mockEP);

      await sut.seedNeighborhoodsByCity(payload);

      const spyConvertedSearch = mockConvertedSearch();
      spyConvertedSearch.city = mockCity;

      sinon.assert.calledOnceWithExactly(publishSpy, payload, mockErr);

      searchByPuppeterAndSaveStub.restore();
      publishSpy.restore();
      validateStub.restore();
    });
  });

  describe('searchByPuppeterAndSave', () => {
    it('should call searchByPuppeterAndSave and call saveNeighborhoodsByCity with the correct params', async () => {
      const guiaMaisStub = sinon
        .stub(mockGuiaMaisRepository, 'getElements')
        .returns(mockNeighborhoods);

      const saveStub = sinon.stub(
        mockSaveNeighborhoodsService,
        'saveNeighborhoodsByCity'
      );

      const mockCity = new City();
      mockCity.name = 'Orleans';
      mockCity.id = 1;

      const spySearch = new SearchNeighborhoodsDTO('brasil', 'SC', 'Orleans');
      const spyConvertedSearch = mockConvertedSearch();
      spyConvertedSearch.city = mockCity;

      await sut.searchByPuppeterAndSave(spySearch, spyConvertedSearch);

      sinon.assert.calledOnceWithExactly(
        saveStub,
        mockNeighborhoods,
        spySearch,
        spyConvertedSearch
      );

      saveStub.restore();
      guiaMaisStub.restore();
    });
  });
});
