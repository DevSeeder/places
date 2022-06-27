import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { GetNeighborhoodsByStateService } from '../../domain/service/neighborhoods/get/get-neighborhoods-by-state.service';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { GetNeighborhoodsByCityService } from '../../domain/service/neighborhoods/get/get-neighborhoods-by-city.service';
import { SearchNeighborhoodsDTO } from '../../domain/model/search/neighborhoods/search-neighborhoods-dto.model';
import { SeedNeighborhoodsByStateService } from '../../domain/service/neighborhoods/seed/seed-neighborhoods-by-state.service';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { NeighborhoodByCity } from 'src/microservice/domain/model/neighborhoods/neighborhood-by-city.model';
import { NeighborhoodsByState } from 'src/microservice/domain/model/neighborhoods/neighborhoods-by-state.model';

@ApiTags('neighborhoods')
@Controller('neighborhoods')
export class NeighborhoodsController extends AbstractController {
  constructor(
    private readonly getNeighborhoodsByCityService: GetNeighborhoodsByCityService,
    private readonly getNeighborhoodsByStateService: GetNeighborhoodsByStateService,
    private readonly seedNeighborhoodsByStateService: SeedNeighborhoodsByStateService
  ) {
    super();
  }

  @ApiOkResponse({
    description: 'Neighborhoods found.',
    isArray: true,
    type: NeighborhoodByCity
  })
  @ApiParam({
    name: 'country',
    required: true,
    description: 'The Country name of the neighborhood',
    type: String
  })
  @ApiParam({
    name: 'state',
    required: true,
    description: 'The State name of the neighborhood',
    type: String
  })
  @ApiParam({
    name: 'city',
    required: true,
    description: 'The City name of the neighborhood',
    type: String
  })
  @Get('/city/:country/:state/:city')
  async getNeighborhoodsByCity(
    @Param() params: SearchNeighborhoodsDTO
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getNeighborhoodsByCityService.getNeighborhoodsByCity(params)
    );
  }

  @ApiOkResponse({
    description: 'Neighborhoods found.',
    type: NeighborhoodsByState
  })
  @ApiParam({
    name: 'country',
    required: true,
    description: 'The Country name of the neighborhood',
    type: String
  })
  @ApiParam({
    name: 'state',
    required: true,
    description: 'The State name of the neighborhood',
    type: String
  })
  @Get('/state/:country/:state')
  async getNeighborhoodsByState(
    @Param() params: SearchNeighborhoodsDTO
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getNeighborhoodsByStateService.getNeighborhoodsByState(params)
    );
  }

  @ApiExcludeEndpoint()
  @Get('/seed/state/:country/:state')
  async seedNeighborhoodsByState(
    @Param() params: SearchNeighborhoodsDTO
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.seedNeighborhoodsByStateService.seedNeighborhoodsByState(
        params
      )
    );
  }
}
