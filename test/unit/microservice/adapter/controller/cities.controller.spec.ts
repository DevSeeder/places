import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../../../src/config/configuration';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ExtensionsModule } from '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { ValidateInputParamsService } from '../../../../../src/microservice/domain/service/validate/validate-input-params.service';
import { CitiesController } from '../../../../../src/microservice/adapter/controller/cities.controller';
import { GetCitiesByStateService } from '../../../../../src/microservice/domain/service/cities/get/get-cities-by-state.service';
import { GetCitiesByCountryService } from '../../../../../src/microservice/domain/service/cities/get/get-cities-by-country.service';
import { SearchCitiesInput } from '../../../../../src/microservice/domain/model/search/cities/search-cities-input.model';
import { City } from '../../../../../src/microservice/domain/schemas/city.schema';

describe('CitiesController', () => {
  let citiesController: CitiesController;

  const mockGetCitiesByStateService = {
    getCitiesByState: () => {
      return;
    }
  };

  const mockGetCitiesByCountryService = {
    getCitiesByCountry: () => {
      return;
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
    city1.name = 'any';

    const city2 = new City();
    city2.name = 'any';
    return [city1, city2];
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        }),
        ExtensionsModule
      ],
      controllers: [CitiesController],
      providers: [
        {
          provide: GetCitiesByStateService,
          useFactory: () => mockGetCitiesByStateService
        },
        {
          provide: GetCitiesByCountryService,
          useFactory: () => mockGetCitiesByCountryService
        },
        {
          provide: ValidateInputParamsService,
          useFactory: () => mockValidateService
        }
      ]
    }).compile();

    citiesController = app.get<CitiesController>(CitiesController);
  });

  describe('getCitiesByState', () => {
    it('should call getCitiesByState and return an array', async () => {
      const getServiceStub = sinon
        .stub(mockGetCitiesByStateService, 'getCitiesByState')
        .returns(mockCities());

      const searchParams = new SearchCitiesInput('brasil', 'sc');

      const actual = await citiesController.getCitiesByState(searchParams);

      expect(actual.body).to.be.an('array').that.contains;
      expect(actual.body).to.have.lengthOf(2);

      getServiceStub.restore();
    });
  });

  describe('getCitiesByCountry', () => {
    it('should call getCitiesByCountry and return an array', async () => {
      const getServiceStub = sinon
        .stub(mockGetCitiesByCountryService, 'getCitiesByCountry')
        .returns(mockCities());

      const actual = await citiesController.getCitiesByCountry('brasil');

      expect(actual.body).to.be.an('array').that.contains;
      expect(actual.body).to.have.lengthOf(2);

      getServiceStub.restore();
    });
  });
});
