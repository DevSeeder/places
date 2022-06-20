import { Logger } from '@nestjs/common';

export abstract class AbstractService {
  protected readonly logger: Logger = new Logger(this.constructor.name);
}
