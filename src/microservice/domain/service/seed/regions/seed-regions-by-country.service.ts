import { Inject, Injectable } from '@nestjs/common';
import { AbstractService } from '../../abstract-service.service';
import { CityPopulationRepository } from '../../../../adapter/repository/regions/puppeteer/citypopulation.repository';
import { Country } from '../../../schemas/country.schema';
import { ValidateCountryByNameOrAliasService } from '../../countries/validate-country-by-name-or-alias.service';
import { RegionsByCountry } from '../../../model/regions/regions-by-country.model';
import { UpdateStatesByRegionService } from '../../states/update-states-by-region.service';
import { SearchRegionsDTO } from '../../../model/search/regions/search-regions-dto.model';
import { SeederService } from '../../../interface/service/seeder-service.interface';

@Injectable()
export class SeedRegionsByCountryService
  extends AbstractService
  implements SeederService<SearchRegionsDTO, Country, RegionsByCountry>
{
  constructor(
    protected readonly validateCountryService: ValidateCountryByNameOrAliasService,
    @Inject('CityPopulationRepository')
    private readonly cityPopulationRepository: CityPopulationRepository,
    private readonly updateStatesByRegionService: UpdateStatesByRegionService
  ) {
    super();
  }

  async seedRegionsByCountry(searchParams: SearchRegionsDTO) {
    const convertedSearch = await this.validateCountryService.validateCountry(
      searchParams.country
    );

    this.logger.log(`Seeding regions for country[${searchParams.country}]...`);
    return this.searchByPuppeterAndSave(searchParams, convertedSearch);
  }

  async searchByPuppeterAndSave(
    searchParams: SearchRegionsDTO,
    convertedSearch: Country
  ): Promise<RegionsByCountry[]> {
    const resPuppeteer = await this.cityPopulationRepository.getElements(
      searchParams,
      convertedSearch
    );

    resPuppeteer.forEach(async (region) => {
      await this.updateStatesByRegionService.updateStatesByRegion(
        region.name,
        region.states,
        convertedSearch.id
      );
    });

    return resPuppeteer;
  }
}
