import { Inject, Injectable } from '@nestjs/common';
import { SearchNeighborhoodsDTO } from '../../../model/search/neighborhoods/search-neighborhoods-dto.model';
import { ValidOutputSearchByCity } from '../../../interface/valid-output-search/valid-outpu-search.interface';
import { NeighborhoodByCity } from '../../../model/neighborhoods/neighborhood-by-city.model';
import { GuiaMaisRepository } from '../../../../adapter/repository/neighborhoods/puppeteer/guia-mais.repository';
import { SaveNeighborhoodsByCityService } from '../../neighborhoods/save-neighborhoods-by-city.service';
import { EventSeedByCityDTO } from '../../../model/dto/events/event-seed-by-city-dto.model';
import { ValidateInputParamsService } from '../../validate/validate-input-params.service';
import { PublishSeedNeighborhoodsByCityService } from './publish/publish-seed-neighborhoods-by-city.service';
import { SeedNeighborhoodsService } from './abstract/seed-neighborhoods.service';

@Injectable()
export class SeedNeighborhoodsByCityService extends SeedNeighborhoodsService {
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    @Inject('GuiaMaisRepository')
    private readonly guiaMaisRepository: GuiaMaisRepository,
    private readonly saveNeighborhoodsService: SaveNeighborhoodsByCityService,
    private readonly publishService: PublishSeedNeighborhoodsByCityService
  ) {
    super();
  }

  async seedNeighborhoodsByCity(eventPayload: EventSeedByCityDTO) {
    const searchParamsByCity = new SearchNeighborhoodsDTO(
      eventPayload.reference.country,
      eventPayload.reference.stateCode,
      eventPayload.reference.cityName
    );

    let convertedSearch: ValidOutputSearchByCity;

    try {
      convertedSearch =
        await this.validateService.validateAndConvertSearchByCity(
          searchParamsByCity
        );
    } catch (err) {
      await this.publishService.publishRefenceError(eventPayload, err);
      return;
    }

    try {
      this.logger.log(
        `Seeding city[${eventPayload.reference.cityId}] ${eventPayload.reference.cityName}...`
      );
      const resPuppeteer = await this.searchByPuppeterAndSave(
        searchParamsByCity,
        convertedSearch
      );

      await this.publishService.publishSuccess(convertedSearch, resPuppeteer);
    } catch (err) {
      await this.publishService.publishError(convertedSearch, err);
    }
  }

  async searchByPuppeterAndSave(
    searchParams: SearchNeighborhoodsDTO,
    convertedSearch: ValidOutputSearchByCity
  ): Promise<NeighborhoodByCity[]> {
    const resPuppeteer = await this.guiaMaisRepository.getElements(
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
}
