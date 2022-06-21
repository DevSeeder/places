import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { GetNeighborhoodsByCityService } from '../../domain/service/neighborhoods/get-neighborhoods-by-city.service';

@Controller('neighborhoods')
export class NeighborhoodsController extends AbstractController {
  constructor(
    private readonly getNeighborhoodsByCityService: GetNeighborhoodsByCityService
  ) {
    super();
  }

  @Get('/city/:country/:state/:city')
  async getNeighborhoodsByCity(
    @Param('country') country,
    @Param('state') state,
    @Param('city') city
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getNeighborhoodsByCityService.getNeighborhoodsByCity(
        country,
        state,
        city
      )
    );
  }
}
