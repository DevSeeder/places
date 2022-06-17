import { Inject, Injectable } from '@nestjs/common';
import { NeighborhoodsByCity } from '../../model/neighborhoods-by-city.model';
import { SearchNeighborhoods } from '../../model/search/search-neighborhoods.model';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { GuiaMaisRepository } from '../../../adapter/repository/neighborhoods/puppeteer/guia-mais.repository';
import { SaveNeighborhoodsByCityService } from './save-neighborhoods-by-city.service';
import { NeighborhoodsService } from './neighborhoods.service';

@Injectable()
export class GetNeighborhoodsByCityService extends NeighborhoodsService {
  constructor(
    @Inject('GuiaMaisRepository')
    private readonly guiaMaisRepository: GuiaMaisRepository,
    private readonly saveNeighborhoodsService: SaveNeighborhoodsByCityService,
    mongoRepository: NeighborhoodsMongoose
  ) {
    super(mongoRepository);
  }

  async getNeighborhoodsByCity(
    country: string,
    state: string,
    city: string
  ): Promise<NeighborhoodsByCity[]> {
    const searchParams = new SearchNeighborhoods(country, state, city);

    const resMongo = await this.findInDatabase(searchParams);

    if (!resMongo.length) {
      const resPuppeteer = await this.guiaMaisRepository.getNeighborhoodsByCity(
        searchParams
      );

      await this.saveNeighborhoodsService.saveNeighborhoodsByCity(
        resPuppeteer,
        searchParams
      );

      return resPuppeteer;
    }

    return resMongo;
  }
}
