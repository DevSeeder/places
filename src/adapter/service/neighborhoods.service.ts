import { Inject, Injectable } from '@nestjs/common';
import { INeighborhoodsService } from 'src/domain/service/neighborhoods-service.interface';
import { NeighborhoodsByCity } from '../../domain/model/neighborhoods-by-city.model';
import { SearchNeighborhoods } from '../../domain/model/search-neighborhoods.model';
import { GuiaMaisRepository } from '../repository/neighborhoods/guia-mais.repository';

@Injectable()
export class NeighborhoodsService implements INeighborhoodsService {
  constructor(
    @Inject('GuiaMaisRepository')
    private readonly guiaMaisRepository: GuiaMaisRepository
  ) {}

  async getNeighborhoodsByCity(
    country: string,
    state: string,
    city: string
  ): Promise<NeighborhoodsByCity[]> {
    const searchParams = new SearchNeighborhoods(country, state, city);
    return this.guiaMaisRepository.getNeighborhoodsByCity(searchParams);
  }
}
