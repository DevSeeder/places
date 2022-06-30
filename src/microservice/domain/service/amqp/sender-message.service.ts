import { AmqplibService } from '@ccmos/nestjs-amqplib';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractService } from '../abstract-service.service';

@Injectable()
export class SenderMessageService extends AbstractService {
  constructor(
    private readonly amqplib: AmqplibService,
    private configService: ConfigService
  ) {
    super();
  }

  async sendMessage(queue: string, payload: object) {
    queue = this.configService.get<string>(
      `microservices.rabbitmq.queue.${queue}`
    );
    this.logger.log(`Sending message to queue: ${queue}...`);
    await this.amqplib.sendToQueue({ queue, payload });
    this.logger.log('Message sent!');

    return {
      success: true,
      response: 'Message sent!'
    };
  }
}
