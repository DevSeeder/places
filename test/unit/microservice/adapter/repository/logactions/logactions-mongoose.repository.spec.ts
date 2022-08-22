import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { ExtensionsModule } from '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { getModelToken } from '@nestjs/mongoose';
import { mockModelMongoose } from '../../../../../mock/mongoose/mock-mongoose';
import { LogActionsMongoose } from '../../../../../../src/microservice/adapter/repository/logactions/logactions-mongoose.repository';
import { LogAction } from '../../../../../../src/microservice/domain/schemas/logaction.schema';

jest.useFakeTimers();
jest.setTimeout(20000);

describe('LogActionsMongoose', () => {
  let sut: LogActionsMongoose;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [ExtensionsModule],
      controllers: [],
      providers: [
        LogActionsMongoose,
        {
          provide: getModelToken(LogAction.name),
          useValue: mockModelMongoose
        }
      ]
    }).compile();

    sut = app.get<LogActionsMongoose>(LogActionsMongoose);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('insertOne', () => {
    it('should call insertOne and call model.create with the correct params', async () => {
      const doc = new LogAction();

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
