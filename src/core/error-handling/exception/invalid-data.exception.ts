import { HttpStatus } from '@nestjs/common';
import { CustomErrorException } from './custom-error.exception';

export class InvalidDataException extends CustomErrorException {
  constructor(element: string, value: string) {
    super(
      `Invalid ${element.capitalize()} '${value}'`,
      HttpStatus.NOT_ACCEPTABLE,
      3
    );
  }
}
