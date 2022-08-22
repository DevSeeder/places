import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { ValidateInputParamsService } from '../../../../../../src/microservice/domain/service/validate/validate-input-params.service';
import { State } from '../../../../../../src/microservice/domain/schemas/state.schema';
import { StatesMongoose } from '../../../../../../src/microservice/adapter/repository/states/states-mongoose.repository';
import { ValidateCountryByNameOrAliasService } from '../../../../../../src/microservice/domain/service/countries/validate-country-by-name-or-alias.service';
import { GetStatesByCountryService } from '../../../../../../src/microservice/domain/service/states/get-states-by-country.service';

describe('GetStatesByCountryService', () => {
  let sut: GetStatesByCountryService;

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

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: StatesMongoose,
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
        GetStatesByCountryService
      ]
    }).compile();

    sut = app.get<GetStatesByCountryService>(GetStatesByCountryService);
  });

  const mockStates = () => {
    const state1 = new State();
    state1.id = 1;
    state1.name = 'any';
    state1.stateCode = 'SC';

    const state2 = new State();
    state1.id = 2;
    state1.name = 'any';
    state1.stateCode = 'RS';

    return [state1, state2];
  };

  describe('getStatesByCountry', () => {
    it('should call getStatesByCountry and return an array', async () => {
      const arrStates = mockStates();
      const getCitiesStub = sinon
        .stub(mockCitiesMongooseRepository, 'findBySearchParams')
        .returns(arrStates);

      const actual = await sut.getStatesByCountry('any');

      expect(actual).to.be.equal(arrStates);

      getCitiesStub.restore();
    });
  });

  describe('findStatesByCountry', () => {
    it('should call findStatesByCountry with arrIgnore and return an array', async () => {
      const arrStates = mockStates();
      const getCitiesStub = sinon
        .stub(mockCitiesMongooseRepository, 'findBySearchParams')
        .returns(arrStates);

      const actual = await sut.findStatesByCountry(1, [3, 2]);

      expect(actual).to.be.equal(arrStates);

      getCitiesStub.restore();
    });
  });
});
