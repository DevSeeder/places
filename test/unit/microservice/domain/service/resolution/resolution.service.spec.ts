import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { ResolutionService } from '../../../../../../src/microservice/domain/service/resolution/resolution.service';
import { LogExecutionService } from '../../../../../../src/microservice/domain/service/logexecutions/log-execution.service';
import { mockLogExecutionService } from '../../../../../../test/mock/services/logexecution/log-execution-service.mock';
import { LogSeedJobService } from '../../../../../../src/microservice/domain/service/logseed/log-seed-job.service';
import {
  mockGetLogSeedByIdService,
  mockLogSeedJobService
} from '../../../../../../test/mock/services/logseed/log-seed-service.mock';
import { ProcessResolutionIsNotACityService } from '../../../../../../src/microservice/domain/service/resolution/process/city/process-resolution-is-not-a-city.service';
import { mockProcessResolutionService } from '../../../../../../test/mock/services/resolution/process-resolution-service.mock';
import { ProcessResolutionWrongCityNameService } from '../../../../../../src/microservice/domain/service/resolution/process/city/process-resolution-wrong-city-name.service';
import { ProcessResolutionUniqueNeighborhoodService } from '../../../../../../src/microservice/domain/service/resolution/process/city/process-resolution-unique-neighborhood.service';
import { LogSeed } from '../../../../../../src/microservice/domain/schemas/logseed.schema';
import { ReferenceResolution } from '../../../../../../src/microservice/domain/model/references/reference-resolution.model';
import { EnumTypeResolution } from '../../../../../../src/microservice/domain/enumerators/enum-type-resolution';
import { GetLogSeedByIdService } from '../../../../../../src/microservice/domain/service/logseed/get-log-seed-by-id.service';

describe('ResolutionService', () => {
  let sut: ResolutionService;

  const mockLogSeed = (): LogSeed => {
    const log = new LogSeed();
    log.processed = false;
    return log;
  };

  const mockRefResolution = (): ReferenceResolution => {
    const refRes = new ReferenceResolution();
    refRes.type = EnumTypeResolution.IsNotACity;
    refRes.idLogSeed = null;
    refRes.dataResolution = 'any';
    return refRes;
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: LogExecutionService,
          useValue: mockLogExecutionService
        },
        {
          provide: LogSeedJobService,
          useValue: mockLogSeedJobService
        },
        {
          provide: GetLogSeedByIdService,
          useValue: mockGetLogSeedByIdService
        },
        {
          provide: ProcessResolutionIsNotACityService,
          useValue: mockProcessResolutionService
        },
        {
          provide: ProcessResolutionWrongCityNameService,
          useValue: mockProcessResolutionService
        },
        {
          provide: ProcessResolutionUniqueNeighborhoodService,
          useValue: mockProcessResolutionService
        },
        ResolutionService
      ]
    }).compile();

    sut = app.get<ResolutionService>(ResolutionService);
  });

  describe('requestResolution', () => {
    it('should call requestResolution correctly', async () => {
      const logExecutionStub = sinon
        .stub(mockLogExecutionService, 'saveLogExecution')
        .returns(null);
      const mockGetLogSeedStub = sinon
        .stub(mockGetLogSeedByIdService, 'getLogSeedById')
        .returns(mockLogSeed());
      const mockProcessSpy = sinon.spy(mockProcessResolutionService, 'process');

      await sut.requestResolution(mockRefResolution());

      sinon.assert.calledOnceWithExactly(
        mockProcessSpy,
        mockLogSeed(),
        mockRefResolution(),
        null
      );

      mockGetLogSeedStub.restore();
      mockProcessSpy.restore();
      logExecutionStub.restore();
    });

    it('should call requestResolution correctly with empty logSeed and throws an error', async () => {
      const logExecutionStub = sinon
        .stub(mockLogExecutionService, 'saveLogExecution')
        .returns(null);
      const mockGetLogSeedStub = sinon
        .stub(mockGetLogSeedByIdService, 'getLogSeedById')
        .returns(false);

      try {
        await sut.requestResolution(mockRefResolution());
      } catch (err) {
        expect(err.message).to.be.equal('LogSeed not found');
      }

      logExecutionStub.restore();
      mockGetLogSeedStub.restore();
    });

    it('should call requestResolution correctly with empty logSeed and throws an error', async () => {
      const logExecutionStub = sinon
        .stub(mockLogExecutionService, 'saveLogExecution')
        .returns(null);

      const mockLogSeedInstance = mockLogSeed();
      mockLogSeedInstance.processed = true;

      const mockGetLogSeedStub = sinon
        .stub(mockGetLogSeedByIdService, 'getLogSeedById')
        .returns(mockLogSeedInstance);

      try {
        await sut.requestResolution(mockRefResolution());
      } catch (err) {
        expect(err.message).to.be.equal('LogSeed Already Processed!');
      }

      mockGetLogSeedStub.restore();
      logExecutionStub.restore();
    });
  });

  describe('processResolution', () => {
    it('should call processResolution correctly', async () => {
      const logExecutionStub = sinon
        .stub(mockLogExecutionService, 'saveLogExecution')
        .returns(null);
      const mockGetLogSeedStub = sinon
        .stub(mockGetLogSeedByIdService, 'getLogSeedById')
        .returns(mockLogSeed());
      const mockProcessSpy = sinon.spy(mockProcessResolutionService, 'process');

      const mockRes = mockRefResolution();
      mockRes.type = null;

      await sut.processResolution(mockLogSeed(), mockRes, null);

      sinon.assert.notCalled(mockProcessSpy);

      mockGetLogSeedStub.restore();
      logExecutionStub.restore();
    });
  });
});
