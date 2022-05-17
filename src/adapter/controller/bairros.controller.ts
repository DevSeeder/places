import { Controller, Get, Param } from '@nestjs/common';
import { BairrosByCity } from 'src/domain/model/bairros-by-city.model';
import { BairrosService } from '../service/bairros.service';

@Controller('bairros')
export class BairrosController {
  constructor(private readonly bairrosService: BairrosService) {}

  @Get('/city/:country/:state/:city')
  getHello(
    @Param('country') country,
    @Param('state') state,
    @Param('city') city
  ): Promise<BairrosByCity[]> {
    return this.bairrosService.getBairrosByCity(country, state, city);
  }
}
