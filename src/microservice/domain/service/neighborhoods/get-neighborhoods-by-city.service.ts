import { Inject, Injectable } from '@nestjs/common';
import { NeighborhoodsByCity } from '../../model/neighborhoods-by-city.model';
import { SearchNeighborhoods } from '../../model/search/search-neighborhoods.model';
import { INeighborhoodsService } from '../../interface/service/neighborhoods-service.interface';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { GuiaMaisRepository } from '../../../adapter/repository/neighborhoods/puppeteer/guia-mais.repository';
import { NeighborhoodsMongoBuilder } from 'src/microservice/adapter/helper/builder/neighborhoods-mongo.builder';

@Injectable()
export class GetNeighborhoodsByCityService implements INeighborhoodsService {
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

    const resMongo = await this.findInDatabase(searchParams);

    if (!resMongo.length)
      return await this.guiaMaisRepository.getNeighborhoodsByCity(searchParams);

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
    const builder = new NeighborhoodsMongoBuilder(res);
    return builder.build();
  }
}
