import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { GetNeighborhoodsByStateService } from '../../domain/service/neighborhoods/get/get-neighborhoods-by-state.service';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { GetNeighborhoodsByCityService } from '../../domain/service/neighborhoods/get/get-neighborhoods-by-city.service';
import { SearchNeighborhoodsInput } from '../../domain/model/search/neighborhoods/search-neighborhoods-input.model';
import { SeedNeighborhoodsByStateService } from '../../domain/service/neighborhoods/seed/seed-neighborhoods-by-state.service';

@Controller('neighborhoods')
export class NeighborhoodsController extends AbstractController {
  constructor(
    private readonly getNeighborhoodsByCityService: GetNeighborhoodsByCityService,
    private readonly getNeighborhoodsByStateService: GetNeighborhoodsByStateService,
    private readonly seedNeighborhoodsByStateService: SeedNeighborhoodsByStateService
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

  @Get('/state/:country/:state')
  async getNeighborhoodsByState(
    @Param() params: SearchNeighborhoodsInput
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getNeighborhoodsByStateService.getNeighborhoodsByState(params)
    );
  }

  @Get('/seed/state/:country/:state')
  async seedNeighborhoodsByState(
    @Param() params: SearchNeighborhoodsInput
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.seedNeighborhoodsByStateService.seedNeighborhoodsByState(
        params
      )
    );
  }
}
