import { Injectable } from '@nestjs/common';
import { SearchNeighborhoodsInput } from '../../../model/search/search-neighborhoods-input.model';
import { NeighborhoodsService } from '../neighborhoods.service';
import { ValidateInputParamsService } from '../../validate-input-params.service';
import { GetCitiesByStateService } from '../../cities/get-cities-by-state.service';
import { SearchCitiesDB } from '../../../model/search/search-cities-db.model';
import { GetNeighborhoodsByCityService } from '../get/get-neighborhoods-by-city.service';
import { ValidOutputSearchNeighborhood } from '../../../interface/valid-output-search/valid-outpu-search-neighborhood.interface';
import { EnumTranslations } from '../../../enumerators/enum-translations.enumerator';
import { City } from '../../../schemas/city.schema';
import { NeighborhoodsMongoose } from '../../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { LogSeedJobService } from '../../logseed/log-seed-job.service';
import { CustomResponse } from '../../../../../core/interface/custom-response.interface';
import { GetNeighborhoodsByStateService } from '../get/get-neighborhoods-by-state.service';

@Injectable()
export class SeedNeighborhoodsByStateService extends NeighborhoodsService {
  constructor(
    mongoRepository: NeighborhoodsMongoose,
    private readonly validateService: ValidateInputParamsService,
    private readonly getNeighborhoodsByCityService: GetNeighborhoodsByCityService,
    private readonly getNeighborhoodsByStateService: GetNeighborhoodsByStateService,
    private readonly getCitiesByStateService: GetCitiesByStateService,
    private readonly logSeedService: LogSeedJobService
  ) {
    super(mongoRepository);
  }

  async seedNeighborhoodsByState(
    searchParams: SearchNeighborhoodsInput
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
    const cities = await this.getCitiesByStateService.getCitiesByState(
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
      try {
        await this.seedByCity(convertedSearch, item);
      } catch (err) {
        this.logger.error(`Error City... ${item.name} - ${item.id}`);
        this.logger.error(err.message);
        console.error(err);
        await this.logErrorSeedJob(convertedSearch, item, err);
      }
    }

    return {
      success: true,
      response: 'Seeded'
    };
  }

  async logErrorSeedJob(
    convertedSearch: ValidOutputSearchNeighborhood,
    city: City,
    err: Error
  ): Promise<void> {
    await this.logSeedService.logSeedByState(
      convertedSearch.country,
      convertedSearch.state,
      city,
      err
    );
  }

  async seedByCity(convertedSearch: ValidOutputSearchNeighborhood, city: City) {
    const searchParamsByCity = new SearchNeighborhoodsInput(
      convertedSearch.country.translations[EnumTranslations.BR],
      convertedSearch.state.stateCode,
      city.name
    );
    convertedSearch.city = city;
    this.logger.log(`Seeding city[${city.id}] ${city.name}...`);
    await this.getNeighborhoodsByCityService.searchByPuppeterAndSave(
      searchParamsByCity,
      convertedSearch
    );
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
