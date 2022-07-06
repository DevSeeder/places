import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../../config/configuration';
import { SenderMessageService } from '../../domain/service/amqp/sender-message.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        exchanges: [
          {
            name: config.get<string>(
              'microservices.rabbitmq.exchange.seed.neighborhoods.by.city.success'
            ),
            type: 'topic'
          }
        ],
        uri: config.get<string>('microservices.rabbitmq.url')
      })
    })
  ],
  controllers: [],
  providers: [
    SenderMessageService,
    {
      provide: 'CLIENT_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('microservices.rabbitmq.url')],
            queue: configService.get<string>(
              'microservices.rabbitmq.queue.events'
            ),
            queueOptions: {
              durable: true
            }
          }
        });
      },
      inject: [ConfigService]
    }
  ],
  exports: [RabbitMQModule, SenderMessageService]
})
export class AMQPModule {}
