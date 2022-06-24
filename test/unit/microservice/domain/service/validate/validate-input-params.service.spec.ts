import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { ValidateStateByNameOrAliasService } from '../../../../../../src/microservice/domain/service/states/validate-state-by-name-or-alias.service';
import { State } from '../../../../../../src/microservice/domain/schemas/state.schema';
import { ValidateInputParamsService } from '../../../../../../src/microservice/domain/service/validate-input-params.service';
import { Country } from '../../../../../../src/microservice/domain/schemas/country.schema';
import { City } from '../../../../../../src/microservice/domain/schemas/city.schema';
import { ValidateCountryByNameOrAliasService } from '../../../../../../src/microservice/domain/service/countries/validate-country-by-name-or-alias.service';
import { ValidateCityByNameOrAliasService } from '../../../../../../src/microservice/domain/service/cities/validate-city-by-name-or-alias.service';
import { SearchNeighborhoodsInput } from '../../../../../../src/microservice/domain/model/search/search-neighborhoods-input.model';

describe('ValidateInputParamsService', () => {
  let sut: ValidateInputParamsService;

  const mockValidateCountry = {
    validateCountry: () => {
      return [new Country()];
    }
  };

  const mockValidateState = {
    validateState: () => {
      return [new State()];
    }
  };

  const mockValidateCity = {
    validateCity: () => {
      return [new City()];
    }
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: ValidateCountryByNameOrAliasService,
          useValue: mockValidateCountry
        },
        {
          provide: ValidateStateByNameOrAliasService,
          useValue: mockValidateState
        },
        {
          provide: ValidateCityByNameOrAliasService,
          useValue: mockValidateCity
        },
        ValidateInputParamsService
      ]
    }).compile();

    sut = app.get<ValidateInputParamsService>(ValidateInputParamsService);
  });

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

  describe('validateAndConvertSearchByCity', () => {
    it('should call validateAndConvertSearchByCity and return an converted search', async () => {
      const validateCountryStub = sinon
        .stub(mockValidateCountry, 'validateCountry')
        .returns(country);

      const validateStateStub = sinon
        .stub(mockValidateState, 'validateState')
        .returns(state);

      const validateCityStub = sinon
        .stub(mockValidateCity, 'validateCity')
        .returns(city);

      const mockConvertedSearch = () => {
        return { country, state, city };
      };

      const searchParams = new SearchNeighborhoodsInput(
        'brasil',
        'sc',
        'orleans'
      );

      const actual = await sut.validateAndConvertSearchByCity(searchParams);

      expect(JSON.stringify(actual)).to.be.equal(
        JSON.stringify(mockConvertedSearch())
      );

      validateCountryStub.restore();
      validateStateStub.restore();
      validateCityStub.restore();
    });
  });

  describe('validateAndConvertSearchByState', () => {
    it('should call validateAndConvertSearchByState and return an converted search', async () => {
      const validateCountryStub = sinon
        .stub(mockValidateCountry, 'validateCountry')
        .returns(country);

      const validateStateStub = sinon
        .stub(mockValidateState, 'validateState')
        .returns(state);

      const mockConvertedSearch = () => {
        return { country, state, city: null };
      };

      const searchParams = new SearchNeighborhoodsInput('brasil', 'sc');

      const actual = await sut.validateAndConvertSearchByState(searchParams);

      expect(JSON.stringify(actual)).to.be.equal(
        JSON.stringify(mockConvertedSearch())
      );

      validateCountryStub.restore();
      validateStateStub.restore();
    });
  });
});
