import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import '../../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { LogSeedJobService } from '../../../../../../../../src/microservice/domain/service/logseed/log-seed-job.service';
import { ValidateInputParamsService } from '../../../../../../../../src/microservice/domain/service/validate/validate-input-params.service';
import { mockValidateService } from '../../../../../../../mock/services/validate/validate-service.mock';
import { mockLogSeedJobService } from '../../../../../../../mock/services/logseed/log-seed-service.mock';
import { mockConvertedSearchOrleans } from '../../../../../../../mock/interfaces/valid-output-search.mock';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { mockAmqpConnection } from '../../../../../../../mock/amqp/aqmp-conneciton.mock';
import { mockSeedNeighborhoodsByStateService } from '../../../../../../../mock/services/seed/seed-neighborhoods-service.mock';
import { ProcessSeedNeighborhoodsByStateService } from '../../../../../../../../src/microservice/domain/service/seed/neighborhoods/process/process-seed-neighborhoods-by-state.service';
import { SeedNeighborhoodsByStateService } from '../../../../../../../../src/microservice/domain/service/seed/neighborhoods/seed-neighborhoods-by-state.service';
import { EventSeedByStateDTOBuilder } from '../../../../../../../../src/microservice/adapter/helper/builder/dto/events/event-seed-by-state-dto.builder';

describe('ProcessSeedNeighborhoodsByStateService', () => {
  let sut: ProcessSeedNeighborhoodsByStateService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: LogSeedJobService,
          useValue: mockLogSeedJobService
        },
        {
          provide: ValidateInputParamsService,
          useValue: mockValidateService
        },
        {
          provide: AmqpConnection,
          useValue: mockAmqpConnection
        },
        {
          provide: SeedNeighborhoodsByStateService,
          useValue: mockSeedNeighborhoodsByStateService
        },
        ProcessSeedNeighborhoodsByStateService
      ]
    }).compile();

    sut = app.get<ProcessSeedNeighborhoodsByStateService>(
      ProcessSeedNeighborhoodsByStateService
    );
  });

  describe('readToSeed', () => {
    it('should call readToSeed and call seedNeighborhoodsByState', async () => {
      const seedSpy = sinon.spy(
        mockSeedNeighborhoodsByStateService,
        'seedNeighborhoodsByState'
      );

      const dtoMock = new EventSeedByStateDTOBuilder(
        mockConvertedSearchOrleans().state
      ).build(mockConvertedSearchOrleans().country);

      await sut.readToSeed(dtoMock);

      sinon.assert.calledOnce(seedSpy);

      seedSpy.restore();
    });
  });
});
