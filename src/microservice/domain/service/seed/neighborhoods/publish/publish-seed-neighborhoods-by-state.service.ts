import { Injectable } from '@nestjs/common';
import { ValidateInputParamsService } from '../../../validate/validate-input-params.service';
import { SenderMessageService } from '../../../amqp/sender-message.service';
import { LogSeedJobService } from '../../../logseed/log-seed-job.service';
import { JobSeedNeighborhoodsService } from '../abstract/job-seed-neighborhoods.service';
import { EventSeedByStateDTOBuilder } from '../../../../../adapter/helper/builder/dto/events/event-seed-by-state-dto.builder';
import { Country } from '../../../../schemas/country.schema';
import { State } from '../../../../schemas/state.schema';
import { PublishSeedService } from '../../../../../domain/interface/service/publish-seed-service.interface';

@Injectable()
export class PublishSeedNeighborhoodsByStateService
  extends JobSeedNeighborhoodsService
  implements PublishSeedService<Country>
{
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    protected readonly logSeedService: LogSeedJobService,
    private readonly senderMessageService: SenderMessageService
  ) {
    super(validateService, logSeedService);
  }

  async publishToSeed(country: Country, state: State) {
    const eventDTO = new EventSeedByStateDTOBuilder(state).build(country);
    await this.senderMessageService.publishMessage(
      'seed.neighborhoods.by.state.process',
      eventDTO
    );
  }
}
