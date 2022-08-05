import { Injectable } from '@nestjs/common';
import { AbstractService } from '../../abstract-service.service';
import { LogActionService } from '../../logactions/log-action.service';

@Injectable()
export abstract class AbstractProcessResolution extends AbstractService {
  constructor(protected readonly logActionService: LogActionService) {
    super();
  }
}
