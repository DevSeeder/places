import { Injectable } from '@nestjs/common';
import { SearchNeighborhoodsDTO } from '../../../model/search/neighborhoods/search-neighborhoods-dto.model';
import { ValidateInputParamsService } from '../../validate/validate-input-params.service';
import { GetCitiesByStateService } from '../../cities/get/get-cities-by-state.service';
import { SearchCitiesDB } from '../../../model/search/cities/search-cities-db.model';
import { CustomResponse } from '../../../../../core/interface/custom-response.interface';
import { GetNeighborhoodsByStateService } from '../../neighborhoods/get/get-neighborhoods-by-state.service';
import { SeedNeighborhoodsService } from './abstract/seed-neighborhoods.service';
import { PublishSeedNeighborhoodsByCityService } from './publish/publish-seed-neighborhoods-by-city.service';

@Injectable()
export class SeedNeighborhoodsByStateService extends SeedNeighborhoodsService {
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    private readonly getNeighborhoodsByStateService: GetNeighborhoodsByStateService,
    private readonly getCitiesByStateService: GetCitiesByStateService,
    private readonly publishService: PublishSeedNeighborhoodsByCityService
  ) {
    super(validateService);
  }

  async seedNeighborhoodsByState(
    searchParams: SearchNeighborhoodsDTO
  ): Promise<CustomResponse> {
    const convertedSearch =
      await this.validateService.validateAndConvertSearchByState(searchParams);

    const arrSeededCities = await this.getSeededCities(
      convertedSearch.state.id
    );

    const searchCities = new SearchCitiesDB(
      convertedSearch.country.id,
      convertedSearch.state.id
    );

    this.logger.log(`Getting cities for state '${searchParams.state}'...`);
    const cities = await this.getCitiesByStateService.findCitiesByState(
      searchCities,
      arrSeededCities
    );

    if (cities.length === 0) {
      this.logger.log('Nothing to seed');
      return {
        success: true,
        response: 'Nothing to seed'
      };
    }

    for await (const item of cities) {
      await this.publishService.publishToSeed(convertedSearch, item);
    }

    return {
      success: true,
      response: 'Seed Requested!'
    };
  }

  async getSeededCities(stateId: number): Promise<number[]> {
    this.logger.log('Getting seeded cities...');
    const aggregatedCities =
      await this.getNeighborhoodsByStateService.groupByCity(stateId);
    return aggregatedCities.map((item) => {
      return item._id.cityId;
    });
  }
}
