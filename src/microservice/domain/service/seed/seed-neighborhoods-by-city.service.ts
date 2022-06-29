import { Inject, Injectable } from '@nestjs/common';
import { SearchNeighborhoodsDTO } from '../../model/search/neighborhoods/search-neighborhoods-dto.model';
import { NeighborhoodsService } from '../neighborhoods/neighborhoods.service';
import {
  ValidOutputSearchByCity,
  ValidOutputSearchByState
} from '../../interface/valid-output-search/valid-outpu-search.interface';
import { EnumTranslations } from '../../enumerators/enum-translations.enumerator';
import { City } from '../../schemas/city.schema';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { NeighborhoodByCity } from '../../model/neighborhoods/neighborhood-by-city.model';
import { GuiaMaisRepository } from '../../../adapter/repository/neighborhoods/puppeteer/guia-mais.repository';
import { SaveNeighborhoodsByCityService } from '../neighborhoods/save-neighborhoods-by-city.service';

@Injectable()
export class SeedNeighborhoodsByCityService extends NeighborhoodsService {
  constructor(
    mongoRepository: NeighborhoodsMongoose,
    @Inject('GuiaMaisRepository')
    private readonly guiaMaisRepository: GuiaMaisRepository,
    private readonly saveNeighborhoodsService: SaveNeighborhoodsByCityService
  ) {
    super(mongoRepository);
  }

  async seedNeighborhoodsByCity(
    convertedSearch: ValidOutputSearchByState,
    city: City
  ) {
    const searchParamsByCity = new SearchNeighborhoodsDTO(
      convertedSearch.country.translations[EnumTranslations.BR],
      convertedSearch.state.stateCode,
      city.name
    );

    this.logger.log(`Seeding city[${city.id}] ${city.name}...`);
    await this.searchByPuppeterAndSave(searchParamsByCity, {
      country: convertedSearch.country,
      state: convertedSearch.state,
      city
    });
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
}
