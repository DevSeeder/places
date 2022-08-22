import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SearchNeighborhoodsDTO } from '../../../../model/search/neighborhoods/search-neighborhoods-dto.model';
import { ValidateInputParamsService } from '../../../validate/validate-input-params.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  subscribeSeedByCityProcess,
  subscribeSeedByCitySuccess
} from '../../../../../../config/amqp/rabbitmq-subscribe.config';
import { MessageSeedNeighborhoodsByCitySuccessDTO } from '../../../../model/dto/messages/message-seed-neighborhoods-by-city-dto.model';
import { GetNeighborhoodsByCityService } from '../../../neighborhoods/get/get-neighborhoods-by-city.service';
import { MissingSeedException } from '../../../../../../core/error-handling/exception/missing-seed.exception';
import { JobSeedNeighborhoodsService } from '../abstract/job-seed-neighborhoods.service';
import { LogSeedJobService } from '../../../logseed/log-seed-job.service';
import { EventSeedByCityDTO } from '../../../../model/dto/events/event-seed-by-city-dto.model';
import { SeedNeighborhoodsByCityService } from '../seed-neighborhoods-by-city.service';

@Injectable()
export class ProcessSeedNeighborhoodsByCityService extends JobSeedNeighborhoodsService {
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    protected readonly logSeedService: LogSeedJobService,
    @Inject(forwardRef(() => GetNeighborhoodsByCityService))
    private readonly getNeighborhoodsService: GetNeighborhoodsByCityService,
    private readonly seedNeighborhoodsByCityService: SeedNeighborhoodsByCityService
  ) {
    super(validateService, logSeedService);
  }

  @RabbitSubscribe(subscribeSeedByCityProcess)
  async readToSeed(msg: EventSeedByCityDTO) {
    this.logger.log(
      `Reading seed process for City[${msg.reference.cityId}] - ${msg.reference.cityName}`
    );
    await this.seedNeighborhoodsByCityService.seedNeighborhoodsByCity(msg);
  }

  @RabbitSubscribe(subscribeSeedByCitySuccess)
  public async readSuccess(msg: MessageSeedNeighborhoodsByCitySuccessDTO) {
    this.logger.log(
      `Reading seed success for City[${msg.reference.cityId}] - ${msg.reference.cityName}`
    );
    const searchParams = new SearchNeighborhoodsDTO(
      msg.reference.country,
      msg.reference.stateCode,
      msg.reference.cityName
    );

    const convertedSearch =
      await this.validateService.validateAndConvertSearchByCity(searchParams);

    const resMongo = await this.getNeighborhoodsService.searchInDatabase(
      convertedSearch
    );

    if (resMongo.length < msg.seededCount) {
      await this.logErrorSeedJob(
        convertedSearch,
        convertedSearch.city,
        new MissingSeedException(
          resMongo.length,
          msg.seededCount,
          'neighborhood'
        )
      );
    }
    this.logger.log('Seed Job successfully done!');
  }
}
