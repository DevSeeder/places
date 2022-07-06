import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
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
    // queue = this.configService.get<string>(
    //   `microservices.rabbitmq.queue.${queue}`
    // );
    this.logger.log(`Publishing message to exchange: ${exchange}...`);

    await this.amqpConnection.publish(exchange, 'sub-1', payload);

    this.logger.log('Message Published!');

    return {
      success: true,
      response: 'Message sent!'
    };
  }

  @RabbitSubscribe({
    exchange: 'seed-exc',
    routingKey: 'sub-1',
    queue: 'seed-places-msg'
  })
  public async pubSubHandler(msg) {
    console.log(`Received message: ${JSON.stringify(msg)}`);
  }
}
