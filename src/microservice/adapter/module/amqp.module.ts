import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SenderMessageService } from '../../domain/service/amqp/sender-message.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { arrExchanges } from '../../../config/amqp/rabbitmq-exchanges.config';
import { channelsConfig } from '../../../config/amqp/rabbitmq-channels.config';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        exchanges: arrExchanges,
        uri: config.get<string>('microservices.rabbitmq.url'),
        noAck: true,
        channels: channelsConfig
      })
    })
  ],
  controllers: [],
  providers: [SenderMessageService],
  exports: [RabbitMQModule, SenderMessageService]
})
export class AMQPModule {}
