import { Injectable } from '@nestjs/common';
import { ValidateInputParamsService } from '../../../validate/validate-input-params.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { subscribeSeedByStateProcess } from '../../../../../../config/amqp/rabbitmq-subscribe.config';
import { JobSeedNeighborhoodsService } from '../abstract/job-seed-neighborhoods.service';
import { LogSeedJobService } from '../../../logseed/log-seed-job.service';
import { EventSeedByStateDTO } from '../../../../../domain/model/dto/events/event-seed-by-state-dto.model';
import { SeedNeighborhoodsByStateService } from '../seed-neighborhoods-by-state.service';
import { SearchNeighborhoodsDTO } from '../../../../../domain/model/search/neighborhoods/search-neighborhoods-dto.model';

@Injectable()
export class ProcessSeedNeighborhoodsByStateService extends JobSeedNeighborhoodsService {
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    protected readonly logSeedService: LogSeedJobService,
    private readonly seedNeighborhoodsByStateService: SeedNeighborhoodsByStateService
  ) {
    super(validateService, logSeedService);
  }

  @RabbitSubscribe(subscribeSeedByStateProcess)
  async readToSeed(msg: EventSeedByStateDTO) {
    const searchParams = new SearchNeighborhoodsDTO(
      msg.reference.country,
      msg.reference.stateCode
    );
    await this.seedNeighborhoodsByStateService.seedNeighborhoodsByState(
      searchParams
    );
  }
}
