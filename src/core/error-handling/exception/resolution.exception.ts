import { HttpStatus } from '@nestjs/common';
import { CustomErrorException } from './custom-error.exception';

export class ResolutionException extends CustomErrorException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
  ) {
    super(message, status, 6);
  }
}
