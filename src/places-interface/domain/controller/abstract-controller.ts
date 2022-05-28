import { NestResponseBuilder } from '../../../core/http/nest-response.builder';

export abstract class AbstractController {
  buildResponse(status, body, header = {}) {
    return new NestResponseBuilder()
      .setStatus(status)
      .setHeader(header)
      .setBody(body)
      .build();
  }
}
