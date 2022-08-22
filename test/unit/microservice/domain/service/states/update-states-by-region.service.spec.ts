import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { State } from '../../../../../../src/microservice/domain/schemas/state.schema';
import { StatesMongoose } from '../../../../../../src/microservice/adapter/repository/states/states-mongoose.repository';
import { UpdateStatesByRegionService } from '../../../../../../src/microservice/domain/service/states/update-states-by-region.service';
import { ValidateStateByNameOrAliasService } from '../../../../../../src/microservice/domain/service/states/validate-state-by-name-or-alias.service';
import { mockValidateStateService } from '../../../../../mock/services/validate/validate-service.mock';

describe('UpdateStatesByRegionService', () => {
  let sut: UpdateStatesByRegionService;

  const mockMongooseRepository = {
    updateById: () => {
      return;
    }
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: StatesMongoose,
          useValue: mockMongooseRepository
        },
        {
          provide: ValidateStateByNameOrAliasService,
          useFactory: () => mockValidateStateService
        },
        UpdateStatesByRegionService
      ]
    }).compile();

    sut = app.get<UpdateStatesByRegionService>(UpdateStatesByRegionService);
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

  describe('updateStatesByRegion', () => {
    it('should call updateStatesByRegion and return an array', async () => {
      const arrStates = mockStates();
      const validateStub = sinon
        .stub(mockValidateStateService, 'validateState')
        .returns(arrStates[0]);

      const updateSpy = sinon.spy(mockMongooseRepository, 'updateById');

      await sut.updateStatesByRegion('any', ['RS'], 1);

      sinon.assert.calledOnceWithExactly(updateSpy, 2, {
        region: 'any'
      });

      validateStub.restore();
      updateSpy.restore();
    });
  });
});
