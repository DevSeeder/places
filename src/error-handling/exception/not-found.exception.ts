import { HttpStatus } from '@nestjs/common';
import { CustomErrorException } from './custom-error.exception';

export class NotFoundException extends CustomErrorException {
  constructor(element = '') {
    super(`${element.capitalize()} not found`, HttpStatus.NOT_FOUND);
  }
}
