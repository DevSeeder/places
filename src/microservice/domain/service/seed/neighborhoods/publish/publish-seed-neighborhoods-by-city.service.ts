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
import { EventSeedByCityDTOBuilder } from '../../../../../adapter/helper/builder/dto/events/event-seed-by-city-dto.builder';
import { DateHelper } from '../../../../../adapter/helper/date.helper';
import { PublishSeedService } from '../../../../../domain/interface/service/publish-seed-service.interface';
import { EventSeedByCityDTO } from '../../../../../domain/model/dto/events/event-seed-by-city-dto.model';
import { ObjectId } from 'mongoose';
import { ReferenceEventByCity } from '../../../../../domain/model/references/event/reference-event-by-city.model';

@Injectable()
export class PublishSeedNeighborhoodsByCityService
  extends JobSeedNeighborhoodsService
  implements PublishSeedService<ValidOutputSearchByState>
{
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    protected readonly logSeedService: LogSeedJobService,
    private readonly senderMessageService: SenderMessageService
  ) {
    super(validateService, logSeedService);
  }

  async publishToSeed(convertedSearch: ValidOutputSearchByState, city: City) {
    const eventDTO = new EventSeedByCityDTOBuilder(convertedSearch).build(city);
    await this.senderMessageService.publishMessage(
      'seed.neighborhoods.by.city.process',
      eventDTO
    );
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
      DateHelper.getDateNow(),
      reference
    );
    await this.senderMessageService.publishMessage(
      'seed.neighborhoods.by.city.success',
      messageDTO
    );
  }

  async publishError(convertedSearch: ValidOutputSearchByCity, err: Error) {
    this.logger.error(
      `Error Seeding City[${convertedSearch.city.id}] - ${convertedSearch.city.name}: ${err.message}`
    );
    const idLog = await this.logSeedService.logSeedByState(
      convertedSearch.country,
      convertedSearch.state,
      convertedSearch.city,
      err
    );

    const reference = new ReferenceEventByCityBuilder(convertedSearch).build(
      convertedSearch.city
    );

    await this.publishMessage(idLog, reference);
  }

  async publishRefenceError(msg: EventSeedByCityDTO, err: Error) {
    this.logger.error(
      `Reference Error Seeding City[${msg.reference.cityId}] - ${msg.reference.cityName}: ${err.message}`
    );

    const referenceDTOInstance = {
      country: {
        id: null,
        name: msg.reference.country,
        translations: {
          br: msg.reference.country
        }
      },
      state: {
        id: null,
        name: msg.reference.stateCode,
        stateCode: msg.reference.stateCode
      },
      city: {
        id: msg.reference.cityId,
        name: msg.reference.cityName
      }
    };

    const idLog = await this.logSeedService.logSeedByState(
      referenceDTOInstance.country,
      referenceDTOInstance.state,
      referenceDTOInstance.city,
      err
    );

    const reference = new ReferenceEventByCityBuilder(
      referenceDTOInstance
    ).build(referenceDTOInstance.city);

    await this.publishMessage(idLog, reference);
  }

  async publishMessage(idLog: ObjectId, reference: ReferenceEventByCity) {
    const messageDTO = new MessageSeedNeighborhoodsByCityErrorDTO(
      idLog,
      DateHelper.getDateNow(),
      reference
    );

    await this.senderMessageService.publishMessage(
      'seed.neighborhoods.by.city.error',
      messageDTO
    );
  }
}
