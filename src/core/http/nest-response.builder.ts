import { CustomResponse } from '../interface/custom-response.interface';
import { NestResponse } from './nest-response';

export class NestResponseBuilder {
  private resposta: NestResponse = {
    status: 200,
    headers: {},
    body: {
      success: true,
      response: ''
    }
  };

  setStatus(status: number) {
    this.resposta.status = status;
    return this;
  }

  setHeader(headers: object) {
    if (headers.isEmpty()) return this;

    this.resposta.headers = headers;
    return this;
  }

  setBody(body: CustomResponse) {
    this.resposta.body = body;
    return this;
  }

  build() {
    return new NestResponse(this.resposta);
  }
}
