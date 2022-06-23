import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { StatesMongoose } from '../../../../../../src/microservice/adapter/repository/states/states-mongoose.repository';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { GetStateByNameOrAliasService } from '../../../../../../src/microservice/domain/service/states/get-state-by-name-or-alias.service';
import { State } from '../../../../../../src/microservice/domain/schemas/state.schema';

describe('GetStateByNameOrAliasService', () => {
  let sut: GetStateByNameOrAliasService;

  const mockStatesMongooseRepository = {
    findByNameOrAlias: () => {
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
        GetStateByNameOrAliasService
      ]
    }).compile();

    sut = app.get<GetStateByNameOrAliasService>(GetStateByNameOrAliasService);
  });

  describe('GetStateByNameOrAliasService', () => {
    it('should call getStateByCity and return an array by mongodb', async () => {
      const mongoFindStub = sinon
        .stub(mockStatesMongooseRepository, 'findByNameOrAlias')
        .returns(mockMongoStates());

      const actual = await sut.getStateByNameOrAlias('sc', 1);

      expect(JSON.stringify(actual)).to.be.equal(
        JSON.stringify(mockMongoStates())
      );

      mongoFindStub.restore();
    });
  });
});
