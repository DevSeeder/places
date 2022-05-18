import { Inject, Injectable } from '@nestjs/common';
// import { BairrosByCity } from 'src/domain/model/bairros-by-city.model';
import { GuiaMaisRepository } from '../repository/guia-mais.repository';

@Injectable()
export class BairrosService {
  constructor(
    @Inject('GuiaMaisRepository') private guiaMaisRepository: GuiaMaisRepository
  ) {}

  async getBairrosByCity(
    country: string,
    state: string,
    city: string
  ): Promise<any> {
    return this.guiaMaisRepository.getBairrosByCity(country, state, city);
  }
}
