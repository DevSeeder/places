import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { routeKeySub } from '../../../../config/amqp/rabbitmq-subscribe.config';
import { AbstractService } from '../abstract-service.service';

@Injectable()
export class SenderMessageService extends AbstractService {
  constructor(
    private readonly configService: ConfigService,
    private readonly amqpConnection: AmqpConnection
  ) {
    super();
  }

  async publishMessage(exchange: string, payload: object) {
    exchange = this.configService.get<string>(
      `microservices.rabbitmq.exchange.${exchange}`
    );
    this.logger.log(`Publishing message to exchange: ${exchange}...`);

    this.amqpConnection.publish(exchange, routeKeySub, payload);

    this.logger.log('Message Published!');

    return {
      success: true,
      response: 'Message sent!'
    };
  }
}
