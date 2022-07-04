import { Injectable } from '@nestjs/common';
import { SearchNeighborhoodsDTO } from '../../model/search/neighborhoods/search-neighborhoods-dto.model';
import { NeighborhoodsService } from '../neighborhoods/neighborhoods.service';
import { ValidateInputParamsService } from '../validate/validate-input-params.service';
import { GetCitiesByStateService } from '../cities/get/get-cities-by-state.service';
import { SearchCitiesDB } from '../../model/search/cities/search-cities-db.model';
import { GetNeighborhoodsByCityService } from '../neighborhoods/get/get-neighborhoods-by-city.service';
import { ValidOutputSearchByState } from '../../interface/valid-output-search/valid-outpu-search.interface';
import { City } from '../../schemas/city.schema';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { CustomResponse } from '../../../../core/interface/custom-response.interface';
import { GetNeighborhoodsByStateService } from '../neighborhoods/get/get-neighborhoods-by-state.service';
import { SenderMessageService } from '../amqp/sender-message.service';
import { EventSeedByCityDTOBuilder } from '../../../adapter/helper/builder/seed/event-seed-by-city-dto.builder';

@Injectable()
export class SeedNeighborhoodsByStateService extends NeighborhoodsService {
  constructor(
    mongoRepository: NeighborhoodsMongoose,
    private readonly validateService: ValidateInputParamsService,
    private readonly getNeighborhoodsByCityService: GetNeighborhoodsByCityService,
    private readonly getNeighborhoodsByStateService: GetNeighborhoodsByStateService,
    private readonly getCitiesByStateService: GetCitiesByStateService,
    private readonly senderMessage: SenderMessageService
  ) {
    super(mongoRepository);
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
      await this.emmitEventSeedByCity(convertedSearch, item);
    }

    return {
      success: true,
      response: 'Seeded'
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

  async emmitEventSeedByCity(
    convertedSearch: ValidOutputSearchByState,
    city: City
  ) {
    const eventDTO = new EventSeedByCityDTOBuilder(convertedSearch).build(city);
    this.senderMessage.emitEvent(
      'seed.neighborhoods.by.city.process',
      eventDTO
    );
  }
}
