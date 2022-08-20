import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { ExtensionsModule } from '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { getModelToken } from '@nestjs/mongoose';
import { mockModelMongoose } from '../../../../../mock/mongoose/mock-mongoose';
import { LogExecutionMongoose } from '../../../../../../src/microservice/adapter/repository/logexecutions/logexecution-mongoose.repository';
import { LogExecution } from '../../../../../../src/microservice/domain/schemas/logexecution.schema';

jest.useFakeTimers();
jest.setTimeout(20000);

describe('LogExecutionMongoose', () => {
  let sut: LogExecutionMongoose;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [ExtensionsModule],
      controllers: [],
      providers: [
        LogExecutionMongoose,
        {
          provide: getModelToken(LogExecution.name),
          useValue: mockModelMongoose
        }
      ]
    }).compile();

    sut = app.get<LogExecutionMongoose>(LogExecutionMongoose);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('insertOne', () => {
    it('should call insertOne and call model.create with the correct params', async () => {
      const doc = new LogExecution();

      const createStubMongo = sinon
        .stub(mockModelMongoose, 'create')
        .yields(null, () => {
          return;
        });

      const createStubSpy = sinon.spy(sut, 'create');

      await sut.insertOne(doc, 'any');

      sinon.assert.calledOnce(createStubMongo);
      sinon.assert.calledOnceWithExactly(createStubSpy, doc);

      createStubMongo.restore();
      createStubSpy.restore();
    });
  });
});
