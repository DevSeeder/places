import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { ReferenceEventByState } from '../../../../../../src/microservice/domain/model/references/event/reference-event-by-state.model';
import { expect } from 'chai';
import { LogExecutionService } from '../../../../../../src/microservice/domain/service/logexecutions/log-execution.service';
import { LogExecutionMongoose } from '../../../../../../src/microservice/adapter/repository/logexecutions/logexecution-mongoose.repository';
import { EnumTypeLogExecution } from '../../../../../../src/microservice/domain/enumerators/enum-type-logexecution';

describe('LogExecutionService', () => {
  let sut: LogExecutionService;

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
          provide: LogExecutionMongoose,
          useValue: mockMongooseRepository
        },
        LogExecutionService
      ]
    }).compile();

    sut = app.get<LogExecutionService>(LogExecutionService);
  });

  describe('saveLogExecution', () => {
    it('should call saveLogExecution and call insertOne correctly', async () => {
      const insertOneStub = sinon
        .stub(mockMongooseRepository, 'insertOne')
        .resolves('any');

      const actual = await sut.saveLogExecution(
        EnumTypeLogExecution.Resolution,
        new ReferenceEventByState()
      );

      sinon.assert.calledOnce(insertOneStub);
      expect(actual).to.be.equal('any');
    });
  });
});
