import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { ValidateInputParamsService } from '../../../../../../../src/microservice/domain/service/validate/validate-input-params.service';
import { City } from '../../../../../../../src/microservice/domain/schemas/city.schema';
import { CitiesMongoose } from '../../../../../../../src/microservice/adapter/repository/cities/cities-mongoose.repository';
import { GetCitiesByCountryService } from '../../../../../../../src/microservice/domain/service/cities/get/get-cities-by-country.service';
import { ValidateCountryByNameOrAliasService } from '../../../../../../../src/microservice/domain/service/countries/validate-country-by-name-or-alias.service';

describe('GetCitiesByCountryService', () => {
  let sut: GetCitiesByCountryService;

  const mockCitiesMongooseRepository = {
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

  const mockValidateCountryService = {
    validateCountry: () => {
      return {};
    }
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
          provide: CitiesMongoose,
          useValue: mockCitiesMongooseRepository
        },
        {
          provide: ValidateInputParamsService,
          useFactory: () => mockValidateService
        },
        {
          provide: ValidateCountryByNameOrAliasService,
          useFactory: () => mockValidateCountryService
        },
        GetCitiesByCountryService
      ]
    }).compile();

    sut = app.get<GetCitiesByCountryService>(GetCitiesByCountryService);
  });

  describe('getCitiesByCountry', () => {
    it('should call getCitiesByCountry and return an array', async () => {
      const arrMockCities = mockCities();
      const getCitiesStub = sinon
        .stub(mockCitiesMongooseRepository, 'findBySearchParams')
        .returns(arrMockCities);

      const actual = await sut.getCitiesByCountry('any');

      expect(actual).to.be.equal(arrMockCities);

      getCitiesStub.restore();
    });
  });
});
