import { Injectable } from '@nestjs/common';
import { BairrosByCity } from 'src/domain/model/bairros-by-city.model';

@Injectable()
export class BairrosService {
  async getBairrosByCity(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    country: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    city: string
  ): Promise<BairrosByCity[]> {
    return [];
  }
}
