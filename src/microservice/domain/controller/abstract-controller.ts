import { Logger } from '@nestjs/common';
import { NestResponseBuilder } from '../../../core/http/nest-response.builder';

export abstract class AbstractController {
  protected readonly logger: Logger = new Logger(this.constructor.name);

  async buildResponse(status, body, header = {}) {
    await this.logger.log('Finishing application request...');
    return new NestResponseBuilder()
      .setStatus(status)
      .setHeader(header)
      .setBody(body)
      .build();
  }
}
