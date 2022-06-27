import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { StatesMongoose } from '../../../../../../src/microservice/adapter/repository/states/states-mongoose.repository';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { ValidateStateByNameOrAliasService } from '../../../../../../src/microservice/domain/service/states/validate-state-by-name-or-alias.service';
import { State } from '../../../../../../src/microservice/domain/schemas/state.schema';

describe('ValidateStateByNameOrAliasService', () => {
  let sut: ValidateStateByNameOrAliasService;

  const mockStatesMongooseRepository = {
    findByNameOrAliasOrId: () => {
      return [new State()];
    }
  };

  const mockMongoStates = () => {
    const arr = [];
    const item1 = new State();
    arr.push(item1);
    return arr;
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: StatesMongoose,
          useValue: mockStatesMongooseRepository
        },
        ValidateStateByNameOrAliasService
      ]
    }).compile();

    sut = app.get<ValidateStateByNameOrAliasService>(
      ValidateStateByNameOrAliasService
    );
  });

  describe('getStateByNameOrAlias', () => {
    it('should call getStateByCity and return an array by mongodb', async () => {
      const mongoFindStub = sinon
        .stub(mockStatesMongooseRepository, 'findByNameOrAliasOrId')
        .returns(mockMongoStates());

      const actual = await sut.getStateByNameOrAlias('sc', 1);

      expect(JSON.stringify(actual)).to.be.equal(
        JSON.stringify(mockMongoStates())
      );

      mongoFindStub.restore();
    });
  });

  describe('validateState', () => {
    it('should call validateState and throws invalid data exception', async () => {
      const getStateStub = sinon
        .stub(mockStatesMongooseRepository, 'findByNameOrAliasOrId')
        .returns([]);

      try {
        await sut.validateState('sc', 1);
      } catch (err) {
        expect(err.message).to.be.equal(`Invalid State 'sc'`);
      }

      getStateStub.restore();
    });

    it('should call validateState and return a object', async () => {
      const state = new State();
      state.name = 'any';
      const getStateStub = sinon
        .stub(mockStatesMongooseRepository, 'findByNameOrAliasOrId')
        .returns([state]);

      const actual = await sut.validateState('orleans', 1);

      expect(actual).to.be.equal(state);

      getStateStub.restore();
    });
  });
});
