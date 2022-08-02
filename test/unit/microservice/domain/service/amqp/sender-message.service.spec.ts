import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { mockAmqpConnection } from '../../../../../mock/amqp/aqmp-conneciton.mock';
import { SenderMessageService } from '../../../../../../src/microservice/domain/service/amqp/sender-message.service';
import { routeKeySub } from '../../../../../../src/config/amqp/rabbitmq-subscribe.config';
import { ConfigService } from '@nestjs/config';
import { mockConfigService } from '../../../../../mock/config/config-service.mock';

describe('SenderMessageService', () => {
  let sut: SenderMessageService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: AmqpConnection,
          useValue: mockAmqpConnection
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        },
        SenderMessageService
      ]
    }).compile();

    sut = app.get<SenderMessageService>(SenderMessageService);
  });

  describe('publishMessage', () => {
    it('should call publishMessage and call and call publish with correct params', async () => {
      const amqpStub = sinon.stub(mockAmqpConnection, 'publish');
      const configStub = sinon.stub(mockConfigService, 'get').returns('any');
      const mockPayload = {
        key: 'any'
      };

      await sut.publishMessage('any', mockPayload);

      sinon.assert.calledOnceWithExactly(
        amqpStub,
        'any',
        routeKeySub,
        mockPayload
      );

      amqpStub.restore();
      configStub.restore();
    });
  });
});
