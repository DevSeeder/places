import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import '../../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { City } from '../../../../../../../../src/microservice/domain/schemas/city.schema';
import { LogSeedJobService } from '../../../../../../../../src/microservice/domain/service/logseed/log-seed-job.service';
import { ValidateInputParamsService } from '../../../../../../../../src/microservice/domain/service/validate/validate-input-params.service';
import { mockValidateService } from '../../../../../../../mock/services/validate/validate-service.mock';
import {
  mockGetLogSeedByIdService,
  mockLogSeedJobService
} from '../../../../../../../mock/services/logseed/log-seed-service.mock';
import { mockConvertedSearchOrleans } from '../../../../../../../mock/interfaces/valid-output-search.mock';
import { mockNeighborhoodsByCity } from '../../../../../../../mock/models/neighborhood/neighborhood-by-city-model.mock';
import { ProcessSeedNeighborhoodsByCityService } from '../../../../../../../../src/microservice/domain/service/seed/neighborhoods/process/process-seed-neighborhoods-by-city.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { mockAmqpConnection } from '../../../../../../../mock/amqp/aqmp-conneciton.mock';
import { GetLogSeedByIdService } from '../../../../../../../../src/microservice/domain/service/logseed/get-log-seed-by-id.service';
import { GetNeighborhoodsByCityService } from '../../../../../../../../src/microservice/domain/service/neighborhoods/get/get-neighborhoods-by-city.service';
import { SeedNeighborhoodsByCityService } from '../../../../../../../../src/microservice/domain/service/seed/neighborhoods/seed-neighborhoods-by-city.service';
import { mockGetNeighborhoodsByCityService } from '../../../../../../../mock/services/neighborhoods/get-neighborhoods-service.mock';
import { mockSeedNeighborhoodsByCityService } from '../../../../../../../mock/services/seed/seed-neighborhoods-service.mock';
import { EventSeedByCityDTOBuilder } from '../../../../../../../../src/microservice/adapter/helper/builder/dto/events/event-seed-by-city-dto.builder';
import { ReferenceEventByCityBuilder } from '../../../../../../../../src/microservice/adapter/helper/builder/dto/reference/reference-event-by-city.builder';
import { MessageSeedNeighborhoodsByCitySuccessDTO } from '../../../../../../../../src/microservice/domain/model/dto/messages/message-seed-neighborhoods-by-city-dto.model';
describe('ProcessSeedNeighborhoodsByCityService', () => {
  let sut: ProcessSeedNeighborhoodsByCityService;

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
          provide: GetLogSeedByIdService,
          useValue: mockGetLogSeedByIdService
        },
        {
          provide: GetNeighborhoodsByCityService,
          useValue: mockGetNeighborhoodsByCityService
        },
        {
          provide: SeedNeighborhoodsByCityService,
          useValue: mockSeedNeighborhoodsByCityService
        },
        ProcessSeedNeighborhoodsByCityService
      ]
    }).compile();

    sut = app.get<ProcessSeedNeighborhoodsByCityService>(
      ProcessSeedNeighborhoodsByCityService
    );
  });

  describe('readToSeed', () => {
    it('should call readToSeed and call seedNeighborhoodsByCity', async () => {
      const seedSpy = sinon.spy(
        mockSeedNeighborhoodsByCityService,
        'seedNeighborhoodsByCity'
      );

      const mockCity = new City();
      mockCity.name = 'Orleans';
      mockCity.id = 1;

      const dtoMock = new EventSeedByCityDTOBuilder(
        mockConvertedSearchOrleans()
      ).build(mockCity);

      await sut.readToSeed(dtoMock);

      sinon.assert.calledOnce(seedSpy);

      seedSpy.restore();
    });
  });

  describe('readSuccess', () => {
    it('should call readSuccess and call publishMessage with the correct params', async () => {
      const validateStub = sinon
        .stub(mockValidateService, 'validateAndConvertSearchByCity')
        .returns(mockConvertedSearchOrleans());

      const getNeighborhoodsStub = sinon
        .stub(
          mockGetNeighborhoodsByCityService,
          'findNeighborhoodsByCityInDatabase'
        )
        .returns(mockNeighborhoodsByCity);

      const logErrorSeedJobSpy = sinon.spy(sut, 'logErrorSeedJob');

      const referenceMock = new ReferenceEventByCityBuilder(
        mockConvertedSearchOrleans()
      ).build(mockConvertedSearchOrleans().city);

      const messageDTO = new MessageSeedNeighborhoodsByCitySuccessDTO(
        2,
        new Date(),
        referenceMock
      );

      await sut.readSuccess(messageDTO);

      sinon.assert.notCalled(logErrorSeedJobSpy);

      validateStub.restore();
      getNeighborhoodsStub.restore();
      logErrorSeedJobSpy.restore();
    });
  });
});
