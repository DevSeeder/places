import { Inject, Injectable } from '@nestjs/common';
import { NeighborhoodsByCity } from '../../model/neighborhoods-by-city.model';
import { SearchNeighborhoods } from '../../model/search/search-neighborhoods.model';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { GuiaMaisRepository } from '../../../adapter/repository/neighborhoods/puppeteer/guia-mais.repository';
import { NeighborhoodsMongoBuilder } from 'src/microservice/adapter/helper/builder/neighborhoods-mongo.builder';
import { SaveNeighborhoodsByCityService } from './save-neighborhoods-by-city.service';

@Injectable()
export class GetNeighborhoodsByCityService {
  constructor(
    @Inject('GuiaMaisRepository')
    private readonly guiaMaisRepository: GuiaMaisRepository,
    private readonly saveNeighborhoodsService: SaveNeighborhoodsByCityService,
    private readonly mongoRepository: NeighborhoodsMongoose
  ) {}

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

  async getAll() {
    return this.mongoRepository.findAll();
  }

  async findInDatabase(
    searchParams: SearchNeighborhoods
  ): Promise<NeighborhoodsByCity[]> {
    const res = await this.mongoRepository.findByCountryStateAndCity(
      searchParams.country,
      searchParams.state,
      searchParams.city
    );
    return new NeighborhoodsMongoBuilder(res).build();
  }
}
