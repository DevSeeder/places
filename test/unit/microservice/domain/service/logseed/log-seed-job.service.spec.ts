import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { LogSeedJobService } from '../../../../../../src/microservice/domain/service/logseed/log-seed-job.service';
import { LogSeedMongoose } from '../../../../../../src/microservice/adapter/repository/logseed/logseed-mongoose.repository';
import { ReferenceNeighborhoodsByState } from '../../../../../../src/microservice/domain/schemas/logseed.schema';
import { NotFoundException } from '../../../../../../src/core/error-handling/exception/not-found.exception';
import { EnumTypeLogSeed } from '../../../../../../src/microservice/domain/enumerators/enum-type-logseed';

describe('LogSeedJobService', () => {
  let sut: LogSeedJobService;

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
          provide: LogSeedMongoose,
          useValue: mockMongooseRepository
        },
        LogSeedJobService
      ]
    }).compile();

    sut = app.get<LogSeedJobService>(LogSeedJobService);
  });

  const reference = new ReferenceNeighborhoodsByState(31, 2014, 1);
  const mockError = new NotFoundException('Neighborhoods');

  describe('logSeedByState', () => {
    it('should call createLogSeed and call insertOne correctly', async () => {
      const insertOneStub = sinon.stub(mockMongooseRepository, 'insertOne');
      const createLogSeedSpy = sinon.spy(sut, 'createLogSeed');

      await sut.logSeedByState(31, 2014, 1, mockError);

      sinon.assert.calledOnceWithExactly(
        createLogSeedSpy,
        EnumTypeLogSeed.NeighborhoodsByState,
        reference,
        mockError
      );

      sinon.assert.calledOnce(insertOneStub);

      insertOneStub.restore();
      createLogSeedSpy.restore();
    });
  });
});
