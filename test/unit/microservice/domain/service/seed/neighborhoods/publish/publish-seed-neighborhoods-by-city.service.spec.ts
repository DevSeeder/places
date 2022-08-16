import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import '../../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { City } from '../../../../../../../../src/microservice/domain/schemas/city.schema';
import { LogSeedJobService } from '../../../../../../../../src/microservice/domain/service/logseed/log-seed-job.service';
import { ValidateInputParamsService } from '../../../../../../../../src/microservice/domain/service/validate/validate-input-params.service';
import { mockValidateService } from '../../../../../../../mock/services/validate/validate-service.mock';
import { PublishSeedNeighborhoodsByCityService } from '../../../../../../../../src/microservice/domain/service/seed/neighborhoods/publish/publish-seed-neighborhoods-by-city.service';
import { mockLogSeedJobService } from '../../../../../../../mock/services/logseed/log-seed-service.mock';
import { SenderMessageService } from '../../../../../../../../src/microservice/domain/service/amqp/sender-message.service';
import { mockSenderMessageService } from '../../../../../../../mock/services/amqp/sender-message-service.mock';
import { mockConvertedSearchOrleans } from '../../../../../../../mock/interfaces/valid-output-search.mock';
import { mockNeighborhoodsByCity } from '../../../../../../../mock/models/neighborhood/neighborhood-by-city-model.mock';
describe('PublishSeedNeighborhoodsByCityService', () => {
  let sut: PublishSeedNeighborhoodsByCityService;

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
          provide: SenderMessageService,
          useValue: mockSenderMessageService
        },
        PublishSeedNeighborhoodsByCityService
      ]
    }).compile();

    sut = app.get<PublishSeedNeighborhoodsByCityService>(
      PublishSeedNeighborhoodsByCityService
    );
  });

  describe('publishToSeed', () => {
    it('should call publishToSeed and call publishMessage with the correct params', async () => {
      const senderMessageStub = sinon
        .stub(mockSenderMessageService, 'publishMessage')
        .returns(null);

      const mockCity = new City();
      mockCity.name = 'Orleans';
      mockCity.id = 1;

      await sut.publishToSeed(mockConvertedSearchOrleans(), mockCity);

      sinon.assert.calledOnce(senderMessageStub);

      senderMessageStub.restore();
    });
  });

  describe('publishSuccess', () => {
    it('should call publishSuccess and call publishMessage with the correct params', async () => {
      const senderMessageStub = sinon
        .stub(mockSenderMessageService, 'publishMessage')
        .returns(null);

      await sut.publishSuccess(
        mockConvertedSearchOrleans(),
        mockNeighborhoodsByCity
      );

      sinon.assert.calledOnce(senderMessageStub);

      senderMessageStub.restore();
    });
  });

  describe('publishError', () => {
    it('should call publishError and call publishMessage with the correct params', async () => {
      const senderMessageStub = sinon
        .stub(mockSenderMessageService, 'publishMessage')
        .returns(null);

      const logSeedStub = sinon
        .stub(mockLogSeedJobService, 'logSeedByState')
        .returns(null);

      const mockErr = new Error('any');

      await sut.publishError(mockConvertedSearchOrleans(), mockErr);

      sinon.assert.calledOnce(senderMessageStub);

      senderMessageStub.restore();
      logSeedStub.restore();
    });
  });
});
