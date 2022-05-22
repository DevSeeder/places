import { Inject, Injectable } from '@nestjs/common';
import { SearchNeighborhoods } from 'src/domain/model/search-neighborhoods.model';
import { GuiaMaisRepository } from '../repository/guia-mais.repository';

@Injectable()
export class NeighborhoodsService {
  constructor(
    @Inject('GuiaMaisRepository') private guiaMaisRepository: GuiaMaisRepository
  ) {}

  async getNeighborhoodsByCity(
    country: string,
    state: string,
    city: string
  ): Promise<any> {
    const searchParams = new SearchNeighborhoods(country, state, city);
    return this.guiaMaisRepository.getNeighborhoodsByCity(searchParams);
  }
}
