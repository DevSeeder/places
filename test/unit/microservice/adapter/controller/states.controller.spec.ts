import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../../../src/config/configuration';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ExtensionsModule } from '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { ValidateInputParamsService } from '../../../../../src/microservice/domain/service/validate/validate-input-params.service';
import { StatesController } from '../../../../../src/microservice/adapter/controller/states.controller';
import { GetStatesByCountryService } from '../../../../../src/microservice/domain/service/states/get-states-by-country.service';
import { State } from '../../../../../src/microservice/domain/schemas/state.schema';

describe('StatesController', () => {
  let statesController: StatesController;

  const mockGetStatesByCountryService = {
    getStatesByCountry: () => {
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

  const mockStates = () => {
    const state1 = new State();
    state1.name = 'any';

    const state2 = new State();
    state2.name = 'any';
    return [state1, state2];
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
      controllers: [StatesController],
      providers: [
        {
          provide: GetStatesByCountryService,
          useFactory: () => mockGetStatesByCountryService
        },
        {
          provide: ValidateInputParamsService,
          useFactory: () => mockValidateService
        }
      ]
    }).compile();

    statesController = app.get<StatesController>(StatesController);
  });

  describe('getStatesByCountry', () => {
    it('should call getStatesByCountry and return an array', async () => {
      const getServiceStub = sinon
        .stub(mockGetStatesByCountryService, 'getStatesByCountry')
        .returns(mockStates());

      const actual = await statesController.getStatesByCountry('brasil');

      expect(actual.body).to.be.an('array').that.contains;
      expect(actual.body).to.have.lengthOf(2);

      getServiceStub.restore();
    });
  });
});
