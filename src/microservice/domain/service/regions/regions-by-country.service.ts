import { Injectable } from '@nestjs/common';
import { GetSeederService } from '../../interface/service/get-seeder-service.interface';
import { SearchRegionsDTO } from '../../model/search/regions/search-regions-dto.model';
import { Country } from '../../schemas/country.schema';
import { ValidateCountryByNameOrAliasService } from '../countries/validate-country-by-name-or-alias.service';
import { SeedRegionsByCountryService } from '../seed/regions/seed-regions-by-country.service';
import { AbstractGetSeederService } from '../abstract-get-seeder.service';
import { RegionsByCountry } from '../../model/regions/regions-by-country.model';
import { GetRegionsByCountryService } from './get-regions-by-country.service';

@Injectable()
export class RegionsByCountryService
  extends AbstractGetSeederService<
    SearchRegionsDTO,
    Country,
    RegionsByCountry,
    RegionsByCountry
  >
  implements GetSeederService<SearchRegionsDTO, Country>
{
  constructor(
    protected readonly validateService: ValidateCountryByNameOrAliasService,
    protected readonly getRegionsByCountry: GetRegionsByCountryService,
    protected readonly seedRegionsByCountry: SeedRegionsByCountryService
  ) {
    super(getRegionsByCountry, seedRegionsByCountry);
  }

  async validateAndConvertInput(
    searchParams: SearchRegionsDTO
  ): Promise<Country> {
    return this.validateService.validateCountry(searchParams.country);
  }
}
