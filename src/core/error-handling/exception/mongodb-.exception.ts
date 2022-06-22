import { HttpStatus } from '@nestjs/common';
import { CustomErrorException } from './custom-error.exception';

export class MongoDBException extends CustomErrorException {
  constructor(message: string, code: string | number) {
    super(message, HttpStatus.BAD_REQUEST, typeof code == 'number' ? code : 4);
  }
}
