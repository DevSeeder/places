import { HttpStatus } from '@nestjs/common';
import { CustomErrorException } from './custom-error.exception';

export class SeedException extends CustomErrorException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 5);
  }
}
