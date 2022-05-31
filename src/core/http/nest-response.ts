import { CustomResponse } from '../interface/custom-response.interface';

export class NestResponse {
  status: number;
  headers: object;
  body: CustomResponse;

  constructor(response: NestResponse) {
    Object.assign(this, response);
  }
}
