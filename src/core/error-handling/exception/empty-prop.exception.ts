import { HttpStatus } from '@nestjs/common';
import { CustomErrorException } from './custom-error.exception';

export class EmptyPropException extends CustomErrorException {
  constructor(element = '') {
    super(
      `The property '${element.capitalize()}' cannot be empty`,
      HttpStatus.NOT_ACCEPTABLE,
      2
    );
  }
}
