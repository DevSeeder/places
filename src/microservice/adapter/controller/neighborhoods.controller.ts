import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { NeighborhoodsService } from '../service/neighborhoods.service';

@Controller('neighborhoods')
export class NeighborhoodsController extends AbstractController {
  constructor(private readonly neighborhoodsService: NeighborhoodsService) {
    super();
  }

  @Get('/city/:country/:state/:city')
  getNeighborhoodsByCity(
    @Param('country') country,
    @Param('state') state,
    @Param('city') city
  ): NestResponse {
    return this.buildResponse(
      HttpStatus.OK,
      this.neighborhoodsService.getNeighborhoodsByCity(country, state, city)
    );
  }

  @Get()
  async getAll() {
    return this.buildResponse(
      HttpStatus.OK,
      await this.neighborhoodsService.getAll()
    );
  }
}
