import { Inject, Injectable } from '@nestjs/common';
import { NeighborhoodsByCity } from '../model/neighborhoods-by-city.model';
import { SearchNeighborhoods } from '../model/search/search-neighborhoods.model';
import { INeighborhoodsService } from './neighborhoods-service.interface';
import { NeighborhoodsMongoose } from '../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';

import { GuiaMaisRepository } from '../../adapter/repository/neighborhoods/puppeteer/guia-mais.repository';

@Injectable()
export class NeighborhoodsService implements INeighborhoodsService {
  constructor(
    @Inject('GuiaMaisRepository')
    private readonly guiaMaisRepository: GuiaMaisRepository,
    private readonly mongoRepository: NeighborhoodsMongoose
  ) {}

  async getNeighborhoodsByCity(
    country: string,
    state: string,
    city: string
  ): Promise<NeighborhoodsByCity[]> {
    const searchParams = new SearchNeighborhoods(country, state, city);
    return this.guiaMaisRepository.getNeighborhoodsByCity(searchParams);
  }

  async getAll() {
    return this.mongoRepository.findAll();
  }

  async getMongoByCity(country: string, state: string, city: string) {
    return this.mongoRepository.findByCountryStateAndCity(country, state, city);
  }
}
