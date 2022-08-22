import { Injectable } from '@nestjs/common';
import { NeighborhoodByCity } from '../../model/neighborhoods/neighborhood-by-city.model';
import { SearchNeighborhoodsDTO } from '../../model/search/neighborhoods/search-neighborhoods-dto.model';
import { ValidOutputSearchByCity } from '../../interface/valid-output-search/valid-outpu-search.interface';
import { ValidateInputParamsService } from '../validate/validate-input-params.service';
import { SeedNeighborhoodsByCityService } from '../seed/neighborhoods/seed-neighborhoods-by-city.service';
import { GetSeederService } from '../../interface/service/get-seeder-service.interface';
import { AbstractGetSeederService } from '../abstract-get-seeder.service';
import { GetNeighborhoodsByCityService } from './get/get-neighborhoods-by-city.service';

@Injectable()
export class NeighborhoodsByCityService
  extends AbstractGetSeederService<
    SearchNeighborhoodsDTO,
    ValidOutputSearchByCity,
    NeighborhoodByCity,
    NeighborhoodByCity
  >
  implements GetSeederService<SearchNeighborhoodsDTO, ValidOutputSearchByCity>
{
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    protected readonly getNeighborhoodsByCity: GetNeighborhoodsByCityService,
    protected readonly seedNeighborhoodsByCity: SeedNeighborhoodsByCityService
  ) {
    super(getNeighborhoodsByCity, seedNeighborhoodsByCity);
  }

  async validateAndConvertInput(
    searchParams: SearchNeighborhoodsDTO
  ): Promise<ValidOutputSearchByCity> {
    return this.validateService.validateAndConvertSearchByCity(searchParams);
  }
}
