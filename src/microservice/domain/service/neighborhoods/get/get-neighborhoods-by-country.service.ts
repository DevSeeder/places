import { Injectable } from '@nestjs/common';
import { NeighborhoodsMongoose } from '../../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { NeighborhoodsService } from '../neighborhoods.service';
import { ValidateInputParamsService } from '../../validate/validate-input-params.service';
import { AggregatedNeighborhoodsByState } from '../../../interface/aggregated/aggregated-neighborhoods-state.interface';

@Injectable()
export class GetNeighborhoodsByCountryService extends NeighborhoodsService {
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    mongoRepository: NeighborhoodsMongoose
  ) {
    super(mongoRepository);
  }

  async groupByCountry(
    countryId: number
  ): Promise<AggregatedNeighborhoodsByState[]> {
    return this.mongoRepository.groupBy(
      { stateId: '$stateId' },
      { countryId },
      { state: 'state' }
    );
  }
}
