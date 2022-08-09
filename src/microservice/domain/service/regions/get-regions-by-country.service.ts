import { Injectable } from '@nestjs/common';
import { GetSeederService } from '../../../domain/interface/service/get-seeder-service.interface';
import { AbstractService } from '../abstract-service.service';
import { SearchRegionsDTO } from '../../model/search/regions/search-regions-dto.model';
import { Country } from '../../schemas/country.schema';
import { RegionsByCountry } from '../../model/regions/regions-by-country.model';
import { StatesMongoose } from '../../../adapter/repository/states/states-mongoose.repository';
import { ValidateCountryByNameOrAliasService } from '../countries/validate-country-by-name-or-alias.service';
import { SeedRegionsByCountryService } from '../seed/regions/seed-regions-by-country.service';
import { AggregatedRegionsByCountry } from '../../interface/aggregated/aggregated-regions-country.interface';

@Injectable()
export class GetRegionsByCountryService
  extends AbstractService
  implements
    GetSeederService<SearchRegionsDTO, Country, RegionsByCountry, string>
{
  constructor(
    protected readonly validateService: ValidateCountryByNameOrAliasService,
    protected readonly seedRegionsByCountry: SeedRegionsByCountryService,
    protected readonly mongoRepository: StatesMongoose
  ) {
    super();
  }

  async getRegionsByCountry(
    searchParams: SearchRegionsDTO
  ): Promise<RegionsByCountry[] | string[]> {
    const convertedSearch = await this.validateAndConvertInput(searchParams);

    const resMongo = await this.searchInDatabase(convertedSearch);

    if (resMongo.length === 0) {
      this.logger.log('Searching by puppeteer...');
      const resPuppeteer = this.searchByPuppeterAndSave(
        searchParams,
        convertedSearch
      );

      this.logger.log('Returning Puppeteer response...');
      return resPuppeteer;
    }

    this.logger.log('Returning MongoDB response...');

    return resMongo;
  }

  async validateAndConvertInput(
    searchParams: SearchRegionsDTO
  ): Promise<Country> {
    return await this.validateService.validateCountry(searchParams.country);
  }

  async searchInDatabase(convertedSearch: Country): Promise<string[]> {
    const aggregated: AggregatedRegionsByCountry[] =
      await this.mongoRepository.groupBy(
        { region: '$region' },
        { countryId: convertedSearch.id }
      );

    return aggregated
      .map((item) => {
        return item._id.region;
      })
      .filter((item) => {
        return item !== null;
      })
      .sort();
  }

  async searchByPuppeterAndSave(
    searchParams: SearchRegionsDTO,
    convertedSearch: Country
  ) {
    return this.seedRegionsByCountry.searchByPuppeterAndSave(
      searchParams,
      convertedSearch
    );
  }
}
