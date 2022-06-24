import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { GetNeighborhoodsByStateService } from '../../domain/service/neighborhoods/get/get-neighborhoods-by-state.service';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { GetNeighborhoodsByCityService } from '../../domain/service/neighborhoods/get/get-neighborhoods-by-city.service';
import { SearchNeighborhoodsDB } from 'src/microservice/domain/model/search/search-neighborhoods-db.model';
import { SearchNeighborhoodsInput } from 'src/microservice/domain/model/search/search-neighborhoods-input.model';

@Controller('neighborhoods')
export class NeighborhoodsController extends AbstractController {
  constructor(
    private readonly getNeighborhoodsByCityService: GetNeighborhoodsByCityService,
    private readonly getNeighborhoodsByStateService: GetNeighborhoodsByStateService
  ) {
    super();
  }

  @Get('/city/:country/:state/:city')
  async getNeighborhoodsByCity(
    @Param() params: SearchNeighborhoodsInput
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getNeighborhoodsByCityService.getNeighborhoodsByCity(params)
    );
  }

  @Get('/city/:country/:state')
  async getNeighborhoodsByState(
    @Param() params: SearchNeighborhoodsInput
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getNeighborhoodsByStateService.getNeighborhoodsByState(params)
    );
  }
}
