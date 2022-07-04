import { Inject, Injectable } from '@nestjs/common';
import { SearchNeighborhoodsDTO } from '../../model/search/neighborhoods/search-neighborhoods-dto.model';
import { NeighborhoodsService } from '../neighborhoods/neighborhoods.service';
import {
  ValidOutputSearchByCity,
  ValidOutputSearchByState
} from '../../interface/valid-output-search/valid-outpu-search.interface';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { NeighborhoodByCity } from '../../model/neighborhoods/neighborhood-by-city.model';
import { GuiaMaisRepository } from '../../../adapter/repository/neighborhoods/puppeteer/guia-mais.repository';
import { SaveNeighborhoodsByCityService } from '../neighborhoods/save-neighborhoods-by-city.service';
import { EventSeedByCityDTO } from '../../model/dto/events/event-seed-by-city-dto.model';
import { ValidateInputParamsService } from '../validate/validate-input-params.service';
import { City } from '../../schemas/city.schema';
import { LogSeedJobService } from '../logseed/log-seed-job.service';

@Injectable()
export class SeedNeighborhoodsByCityService extends NeighborhoodsService {
  constructor(
    mongoRepository: NeighborhoodsMongoose,
    @Inject('GuiaMaisRepository')
    private readonly guiaMaisRepository: GuiaMaisRepository,
    protected readonly validateService: ValidateInputParamsService,
    private readonly saveNeighborhoodsService: SaveNeighborhoodsByCityService,
    private readonly logSeedService: LogSeedJobService
  ) {
    super(mongoRepository);
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
      await this.searchByPuppeterAndSave(searchParamsByCity, convertedSearch);
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
}
