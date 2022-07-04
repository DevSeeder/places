import { AmqplibService } from '@ccmos/nestjs-amqplib';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { EnumConfigAMQP } from 'src/microservice/adapter/helper/config/config.helper';
import { AbstractService } from '../abstract-service.service';

@Injectable()
export class SenderMessageService extends AbstractService {
  constructor(
    private readonly amqplib: AmqplibService,
    @Inject('CLIENT_SERVICE') private client: ClientProxy,
    private configService: ConfigService
  ) {
    super();
  }

  async emmitEvent(configPattern: string, payload: object) {
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

  async sendMessage(queue: string, payload: object) {
    queue = this.configService.get<string>(
      `microservices.rabbitmq.queue.${queue}`
    );
    this.logger.log(`Sending message to queue: ${queue}...`);
    // await this.amqplib.sendToQueue({ queue, payload });
    await this.client.send<string>({ cmd: 'seed-by-city' }, payload);
    this.logger.log('Message sent!');

    return {
      success: true,
      response: 'Message sent!'
    };
  }
}
