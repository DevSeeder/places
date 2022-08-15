import { Injectable } from '@nestjs/common';
import { AbstractService } from '../../../abstract-service.service';

@Injectable()
export abstract class SeedNeighborhoodsService extends AbstractService {
  constructor() {
    super();
  }
}
