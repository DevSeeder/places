import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import '../../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { LogSeedJobService } from '../../../../../../../../src/microservice/domain/service/logseed/log-seed-job.service';
import { ValidateInputParamsService } from '../../../../../../../../src/microservice/domain/service/validate/validate-input-params.service';
import { mockValidateService } from '../../../../../../../mock/services/validate/validate-service.mock';
import { mockLogSeedJobService } from '../../../../../../../mock/services/logseed/log-seed-service.mock';
import { SenderMessageService } from '../../../../../../../../src/microservice/domain/service/amqp/sender-message.service';
import { mockSenderMessageService } from '../../../../../../../mock/services/amqp/sender-message-service.mock';
import { mockConvertedSearchOrleans } from '../../../../../../../mock/interfaces/valid-output-search.mock';
import { PublishSeedNeighborhoodsByStateService } from '../../../../../../../../src/microservice/domain/service/seed/neighborhoods/publish/publish-seed-neighborhoods-by-state.service';
describe('PublishSeedNeighborhoodsByStateService', () => {
  let sut: PublishSeedNeighborhoodsByStateService;

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
        PublishSeedNeighborhoodsByStateService
      ]
    }).compile();

    sut = app.get<PublishSeedNeighborhoodsByStateService>(
      PublishSeedNeighborhoodsByStateService
    );
  });

  describe('publishToSeed', () => {
    it('should call publishToSeed and call publishMessage with the correct params', async () => {
      const senderMessageStub = sinon
        .stub(mockSenderMessageService, 'publishMessage')
        .returns(null);

      await sut.publishToSeed(
        mockConvertedSearchOrleans().country,
        mockConvertedSearchOrleans().state
      );

      sinon.assert.calledOnce(senderMessageStub);

      senderMessageStub.restore();
    });
  });
});
