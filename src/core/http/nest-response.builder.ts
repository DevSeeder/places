import { CustomResponse } from '../interface/custom-response.interface';
import { NestResponse } from './nest-response';

export class NestResponseBuilder {
  protected response: NestResponse = {
    status: 200,
    headers: {},
    body: {
      success: true,
      response: ''
    }
  };

  setStatus(status: number) {
    this.response.status = status;
    return this;
  }

  setHeader(headers: any) {
    if (Object.keys(headers).length === 0) return this;
    this.response.headers = headers;
    return this;
  }

  setBody(body: CustomResponse) {
    this.response.body = body;
    return this;
  }

  build() {
    return new NestResponse(this.response);
  }
}
