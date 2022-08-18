import { Injectable } from '@nestjs/common';
import { CustomResponse } from '../../../../../core/interface/custom-response.interface';
import { SeedNeighborhoodsService } from './abstract/seed-neighborhoods.service';
import { GetStatesByCountryService } from '../../states/get-states-by-country.service';
import { ValidateCountryByNameOrAliasService } from '../../countries/validate-country-by-name-or-alias.service';
import { PublishSeedNeighborhoodsByStateService } from './publish/publish-seed-neighborhoods-by-state.service';
import { GetNeighborhoodsByCountryService } from '../../neighborhoods/get/get-neighborhoods-by-country.service';

@Injectable()
export class SeedNeighborhoodsByCountryService extends SeedNeighborhoodsService {
  constructor(
    protected readonly validateService: ValidateCountryByNameOrAliasService,
    private readonly getStatesByCountryService: GetStatesByCountryService,
    private readonly getNeighborhoodsByCountryService: GetNeighborhoodsByCountryService,
    private readonly publishService: PublishSeedNeighborhoodsByStateService
  ) {
    super();
  }

  async seedNeighborhoodsByCountry(country: string): Promise<CustomResponse> {
    const convertedSearch = await this.validateService.validateCountry(country);

    this.logger.log(`Getting states for Country '${country}'...`);
    const states = await this.getStatesByCountryService.findStatesByCountry(
      convertedSearch.id
    );

    if (states.length === 0) {
      this.logger.log('Nothing to seed');
      return {
        success: true,
        response: 'Nothing to seed'
      };
    }

    for await (const item of states) {
      await this.publishService.publishToSeed(convertedSearch, item);
    }

    return {
      success: true,
      response: 'Seed Requested!'
    };
  }
}
