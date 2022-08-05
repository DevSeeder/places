import { HttpStatus } from '@nestjs/common';
import { ResolutionException } from './resolution.exception';

export class InvalidLogSeedResolutionException extends ResolutionException {
  constructor(type: string, idLogSeed: string) {
    super(
      `Invalid LogSeed[${idLogSeed}] for resolution type '${type}'`,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
