import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { routeKeySub } from 'src/config/amqp/rabbitmq-subscribe.config';
import { EnumConfigAMQP } from 'src/microservice/adapter/helper/config/config.helper';
import { AbstractService } from '../abstract-service.service';

@Injectable()
export class SenderMessageService extends AbstractService {
  constructor(
    @Inject('CLIENT_SERVICE') private client: ClientProxy,
    private configService: ConfigService,
    private readonly amqpConnection: AmqpConnection
  ) {
    super();
  }

  async emitEvent(configPattern: string, payload: object) {
    const eventPattern = this.configService.get<string>(
      `${EnumConfigAMQP.EVENT}.${configPattern}`
    );
    this.logger.log(`Emmiting event '${eventPattern}'...`);
    await this.client.emit<string>(eventPattern, payload);
    return {
      success: true,
      response: 'Event emmited!'
    };
  }

  async publishMessage(exchange: string, payload: object) {
    exchange = this.configService.get<string>(
      `microservices.rabbitmq.exchange.${exchange}`
    );
    this.logger.log(`Publishing message to exchange: ${exchange}...`);

    await this.amqpConnection.publish(exchange, routeKeySub, payload);

    this.logger.log('Message Published!');

    return {
      success: true,
      response: 'Message sent!'
    };
  }
}
