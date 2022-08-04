import { Injectable } from '@nestjs/common';
import { ValidateInputParamsService } from '../../../validate/validate-input-params.service';
import { AbstractService } from '../../../abstract-service.service';

@Injectable()
export abstract class SeedNeighborhoodsService extends AbstractService {
  constructor(protected readonly validateService: ValidateInputParamsService) {
    super();
  }
}
