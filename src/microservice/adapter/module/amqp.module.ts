import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SenderMessageService } from '../../domain/service/amqp/sender-message.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { arrExchanges } from '../../../config/amqp/rabbitmq-exchanges.config';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        exchanges: arrExchanges,
        uri: config.get<string>('microservices.rabbitmq.url'),
        noAck: true,
        channels: {
          'channel-1': {
            prefetchCount: 1,
            default: true
          },
          'channel-2': {
            prefetchCount: 1
          }
        }
      })
    })
  ],
  controllers: [],
  providers: [SenderMessageService],
  exports: [RabbitMQModule, SenderMessageService]
})
export class AMQPModule {}
