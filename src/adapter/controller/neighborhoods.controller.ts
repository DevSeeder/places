import { Controller, Get, Param } from '@nestjs/common';
import { NeighborhoodsService } from '../service/neighborhoods.service';

@Controller('neighborhoods')
export class NeighborhoodsController {
  constructor(private readonly neighborhoodsService: NeighborhoodsService) {}

  @Get('/city/:country/:state/:city')
  async getNeighborhoodsByCity(
    @Param('country') country,
    @Param('state') state,
    @Param('city') city
  ): Promise<any> {
    return await this.neighborhoodsService.getNeighborhoodsByCity(
      country,
      state,
      city
    );
  }
}
