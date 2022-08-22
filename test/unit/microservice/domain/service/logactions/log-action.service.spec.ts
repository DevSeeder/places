import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { LogActionService } from '../../../../../../src/microservice/domain/service/logactions/log-action.service';
import { LogActionsMongoose } from '../../../../../../src/microservice/adapter/repository/logactions/logactions-mongoose.repository';
import { EnumTypeAction } from '../../../../../../src/microservice/domain/enumerators/enum-type-action';
import { ReferenceEventByState } from '../../../../../../src/microservice/domain/model/references/event/reference-event-by-state.model';
import { expect } from 'chai';

describe('LogActionService', () => {
  let sut: LogActionService;

  const mockMongooseRepository = {
    insertOne: () => {
      return;
    }
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: LogActionsMongoose,
          useValue: mockMongooseRepository
        },
        LogActionService
      ]
    }).compile();

    sut = app.get<LogActionService>(LogActionService);
  });

  describe('saveLogAction', () => {
    it('should call saveLogAction and call insertOne correctly', async () => {
      const insertOneStub = sinon
        .stub(mockMongooseRepository, 'insertOne')
        .resolves('any');

      const actual = await sut.saveLogAction(
        EnumTypeAction.CreateManualNeighborhood,
        new ReferenceEventByState(),
        'any',
        'any'
      );

      sinon.assert.calledOnce(insertOneStub);
      expect(actual).to.be.equal('any');
    });
  });
});
