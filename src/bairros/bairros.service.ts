import { Injectable } from '@nestjs/common';

@Injectable()
export class BairrosService {
  getHello(): string {
    return 'Hello World!';
  }
}
