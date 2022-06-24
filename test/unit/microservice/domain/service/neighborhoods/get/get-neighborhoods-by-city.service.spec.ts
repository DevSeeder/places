import { Test, TestingModule } from '@nestjs/testing';
import { GetNeighborhoodsByCityService } from '../../../../../../../src/microservice/domain/service/neighborhoods/get/get-neighborhoods-by-city.service';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { NeighborhoodByCity } from '../../../../../../../src/microservice/domain/model/neighborhoods/neighborhood-by-city.model';
import { SaveNeighborhoodsByCityService } from '../../../../../../../src/microservice/domain/service/neighborhoods/save-neighborhoods-by-city.service';
import { NeighborhoodsMongoose } from '../../../../../../../src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { Neighborhood } from '../../../../../../../src/microservice/domain/schemas/neighborhood.schema';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { GetCountryByNameOrAliasService } from '../../../../../../../src/microservice/domain/service/countries/get-country-by-name-or-alias.service';
import { Country } from '../../../../../../../src/microservice/domain/schemas/country.schema';
import { CountriesMongoose } from '../../../../../../../src/microservice/adapter/repository/countries/countries-mongoose.repository';
import { CitiesMongoose } from '../../../../../../../src/microservice/adapter/repository/cities/cities-mongoose.repository';
import { StatesMongoose } from '../../../../../../../src/microservice/adapter/repository/states/states-mongoose.repository';
import { GetCityByNameOrAliasService } from '../../../../../../../src/microservice/domain/service/cities/get-city-by-name-or-alias.service';
import { GetStateByNameOrAliasService } from '../../../../../../../src/microservice/domain/service/states/get-state-by-name-or-alias.service';
import { City } from '../../../../../../../src/microservice/domain/schemas/city.schema';
import { State } from '../../../../../../../src/microservice/domain/schemas/state.schema';

describe('GetNeighborhoodsByCityService', () => {
  let sut: GetNeighborhoodsByCityService;

  const mockGuiaMaisRepository = {
    getNeighborhoodsByCity: () => {
      return;
    }
  };

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

  const mockSaveNeighborhoodsService = {
    saveNeighborhoodsByCity: () => {
      return;
    },
    findNeighborhoodInDatabase: () => {
      return [];
    }
  };

  const mockGetCountryService = {
    getCountryByNameOrAlias: () => {
      return [new Country()];
    }
  };

  const mockGetStateService = {
    getStateByNameOrAlias: () => {
      return [new State()];
    }
  };

  const mockGetCityService = {
    getCityByNameOrAlias: () => {
      return [new City()];
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
      city: 'Orleans-SC'
    },
    {
      name: 'Alto Paraná',
      city: 'Orleans-SC'
    }
  ];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: 'GuiaMaisRepository',
          useValue: mockGuiaMaisRepository
        },
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
          provide: SaveNeighborhoodsByCityService,
          useFactory: () => mockSaveNeighborhoodsService
        },
        {
          provide: GetCountryByNameOrAliasService,
          useFactory: () => mockGetCountryService
        },
        {
          provide: GetStateByNameOrAliasService,
          useFactory: () => mockGetStateService
        },
        {
          provide: GetCityByNameOrAliasService,
          useFactory: () => mockGetCityService
        },
        GetNeighborhoodsByCityService
      ]
    }).compile();

    sut = app.get<GetNeighborhoodsByCityService>(GetNeighborhoodsByCityService);
  });

  describe('GetNeighborhoodsByCityService', () => {
    it('should call getNeighborhoodsByCity and return an array by puppeteer', async () => {
      const guiaMaisStub = sinon
        .stub(mockGuiaMaisRepository, 'getNeighborhoodsByCity')
        .returns(mockNeighborhoods);

      const actual = await sut.getNeighborhoodsByCity(
        'brasil',
        'sc',
        'orleans'
      );

      expect(actual).to.be.an('array');
      expect(actual.length).to.be.equal(2);

      guiaMaisStub.restore();
    });

    it('should call getNeighborhoodsByCity and return an array by mongodb', async () => {
      const mongoFindStub = sinon
        .stub(sut, 'findInDatabase')
        .returns(mockMongoNeighborhoods());

      const actual = await sut.getNeighborhoodsByCity(
        'brasil',
        'sc',
        'orleans'
      );

      expect(JSON.stringify(actual)).to.be.equal(
        JSON.stringify(mockMongoNeighborhoods())
      );

      mongoFindStub.restore();
    });

    describe('validateCountry', () => {
      it('should call validateCountry and throws invalid data exception', async () => {
        const getCountryStub = sinon
          .stub(mockGetCountryService, 'getCountryByNameOrAlias')
          .returns([]);

        try {
          await sut.validateCountry('brasil');
        } catch (err) {
          expect(err.message).to.be.equal(`Invalid Country 'brasil'`);
        }

        getCountryStub.restore();
      });
    });

    describe('validateState', () => {
      it('should call validateState and throws invalid data exception', async () => {
        const getStateStub = sinon
          .stub(mockGetStateService, 'getStateByNameOrAlias')
          .returns([]);

        try {
          await sut.validateState('sc', 1);
        } catch (err) {
          expect(err.message).to.be.equal(`Invalid State 'sc'`);
        }

        getStateStub.restore();
      });
    });

    describe('validateCity', () => {
      it('should call validateCity and throws invalid data exception', async () => {
        const getCityStub = sinon
          .stub(mockGetCityService, 'getCityByNameOrAlias')
          .returns([]);

        try {
          await sut.validateCity('orleans', 1, 2);
        } catch (err) {
          expect(err.message).to.be.equal(`Invalid City 'orleans'`);
        }

        getCityStub.restore();
      });
    });
  });
});
