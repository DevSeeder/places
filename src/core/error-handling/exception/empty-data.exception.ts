import { HttpStatus } from '@nestjs/common';
import { CustomErrorException } from './custom-error.exception';

export class EmptyDataException extends CustomErrorException {
  constructor(element = '') {
    super(
      `The ${element} data cannot be empty`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      1
    );
  }
}
