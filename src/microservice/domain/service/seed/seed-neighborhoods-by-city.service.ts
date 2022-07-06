import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SearchNeighborhoodsDTO } from '../../model/search/neighborhoods/search-neighborhoods-dto.model';
import {
  ValidOutputSearchByCity,
  ValidOutputSearchByState
} from '../../interface/valid-output-search/valid-outpu-search.interface';
import { NeighborhoodByCity } from '../../model/neighborhoods/neighborhood-by-city.model';
import { GuiaMaisRepository } from '../../../adapter/repository/neighborhoods/puppeteer/guia-mais.repository';
import { SaveNeighborhoodsByCityService } from '../neighborhoods/save-neighborhoods-by-city.service';
import { EventSeedByCityDTO } from '../../model/dto/events/event-seed-by-city-dto.model';
import { ValidateInputParamsService } from '../validate/validate-input-params.service';
import { City } from '../../schemas/city.schema';
import { LogSeedJobService } from '../logseed/log-seed-job.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { subscribeSeedByCitySucess } from '../../../../config/amqp/rabbitmq-subscribe.config';
import { AbstractService } from '../abstract-service.service';
import { SenderMessageService } from '../amqp/sender-message.service';
import { MessageSeedNeighborhoodsByCitySuccessDTO } from '../../model/dto/messages/message-seed-neighborhoods-by-city-success-dto.model';
import { ReferenceEventByCityBuilder } from '../../../adapter/helper/builder/dto/reference/reference-event-by-city.builder';
import { GetNeighborhoodsByCityService } from '../neighborhoods/get/get-neighborhoods-by-city.service';
import { MissingSeedException } from '../../../../core/error-handling/exception/missing-seed.exception';

@Injectable()
export class SeedNeighborhoodsByCityService extends AbstractService {
  constructor(
    @Inject('GuiaMaisRepository')
    private readonly guiaMaisRepository: GuiaMaisRepository,
    protected readonly validateService: ValidateInputParamsService,
    private readonly saveNeighborhoodsService: SaveNeighborhoodsByCityService,
    private readonly logSeedService: LogSeedJobService,
    private readonly senderMessageService: SenderMessageService,
    @Inject(forwardRef(() => GetNeighborhoodsByCityService))
    private readonly getNeighborhoodsService: GetNeighborhoodsByCityService
  ) {
    super();
  }

  async seedNeighborhoodsByCity(eventPayload: EventSeedByCityDTO) {
    const searchParamsByCity = new SearchNeighborhoodsDTO(
      eventPayload.reference.country,
      eventPayload.reference.stateCode,
      eventPayload.reference.cityName
    );

    const convertedSearch =
      await this.validateService.validateAndConvertSearchByCity(
        searchParamsByCity
      );

    try {
      this.logger.log(
        `Seeding city[${eventPayload.reference.cityId}] ${eventPayload.reference.cityName}...`
      );
      const resPuppeteer = await this.searchByPuppeterAndSave(
        searchParamsByCity,
        convertedSearch
      );

      await this.publishSuccess(convertedSearch, resPuppeteer);
    } catch (err) {
      await this.logErrorSeedJob(convertedSearch, convertedSearch.city, err);
    }
  }

  async searchByPuppeterAndSave(
    searchParams: SearchNeighborhoodsDTO,
    convertedSearch: ValidOutputSearchByCity
  ): Promise<NeighborhoodByCity[]> {
    const resPuppeteer = await this.guiaMaisRepository.getNeighborhoodsByCity(
      searchParams,
      convertedSearch
    );

    await this.saveNeighborhoodsService.saveNeighborhoodsByCity(
      resPuppeteer,
      searchParams,
      convertedSearch
    );

    return resPuppeteer;
  }

  async publishSuccess(convertedSearch, resPuppeteer) {
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

  async logErrorSeedJob(
    convertedSearch: ValidOutputSearchByState,
    city: City,
    err: Error
  ): Promise<void> {
    this.logger.error(`Error City[${city.id}] ${city.name}`);
    this.logger.error(err.message);
    console.error(err);
    await this.logSeedService.logSeedByState(
      convertedSearch.country,
      convertedSearch.state,
      city,
      err
    );
  }

  @RabbitSubscribe(subscribeSeedByCitySucess)
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

    const resMongo =
      await this.getNeighborhoodsService.findNeighborhoodsByCityInDatabase(
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
