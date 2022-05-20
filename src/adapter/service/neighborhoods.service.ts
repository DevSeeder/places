import { Inject, Injectable } from '@nestjs/common';
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
    return this.guiaMaisRepository.getNeighborhoodsByCity(country, state, city);
  }
}
