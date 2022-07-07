import { Injectable } from '@nestjs/common';
import {
  ValidOutputSearchByCity,
  ValidOutputSearchByState
} from '../../../../interface/valid-output-search/valid-outpu-search.interface';
import { NeighborhoodByCity } from '../../../../model/neighborhoods/neighborhood-by-city.model';
import { ValidateInputParamsService } from '../../../validate/validate-input-params.service';
import { SenderMessageService } from '../../../amqp/sender-message.service';
import {
  MessageSeedNeighborhoodsByCityErrorDTO,
  MessageSeedNeighborhoodsByCitySuccessDTO
} from '../../../../model/dto/messages/message-seed-neighborhoods-by-city-dto.model';
import { ReferenceEventByCityBuilder } from '../../../../../adapter/helper/builder/dto/reference/reference-event-by-city.builder';
import { LogSeedJobService } from '../../../logseed/log-seed-job.service';
import { JobSeedNeighborhoodsService } from '../abstract/job-seed-neighborhoods.service';
import { City } from '../../../../schemas/city.schema';

@Injectable()
export class PublishSeedNeighborhoodsByCityService extends JobSeedNeighborhoodsService {
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    protected readonly logSeedService: LogSeedJobService,
    private readonly senderMessageService: SenderMessageService
  ) {
    super(validateService, logSeedService);
  }

  async publishSuccess(
    convertedSearch: ValidOutputSearchByCity,
    resPuppeteer: NeighborhoodByCity[]
  ) {
    const reference = new ReferenceEventByCityBuilder(convertedSearch).build(
      convertedSearch.city
    );
    const messageDTO = new MessageSeedNeighborhoodsByCitySuccessDTO(
      resPuppeteer.length,
      new Date(),
      reference
    );
    await this.senderMessageService.publishMessage(
      'seed.neighborhoods.by.city.success',
      messageDTO
    );
  }

  async publishError(
    convertedSearch: ValidOutputSearchByState,
    city: City,
    err: Error
  ) {
    const idLog = await this.logSeedService.logSeedByState(
      convertedSearch.country,
      convertedSearch.state,
      city,
      err
    );

    const reference = new ReferenceEventByCityBuilder(convertedSearch).build(
      city
    );

    const messageDTO = new MessageSeedNeighborhoodsByCityErrorDTO(
      idLog,
      new Date(),
      reference
    );

    await this.senderMessageService.publishMessage(
      'seed.neighborhoods.by.city.success',
      messageDTO
    );
  }
}
