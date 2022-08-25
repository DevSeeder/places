import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { GetNeighborhoodsByStateService } from '../../domain/service/neighborhoods/get/get-neighborhoods-by-state.service';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { SearchNeighborhoodsDTO } from '../../domain/model/search/neighborhoods/search-neighborhoods-dto.model';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { NeighborhoodByCity } from '../../domain/model/neighborhoods/neighborhood-by-city.model';
import { NeighborhoodsByState } from '../../domain/model/neighborhoods/neighborhoods-by-state.model';
import { NeighborhoodsByCityService } from '../../domain/service/neighborhoods/neighborhoods-by-city.service';
import { JwtAuthGuard } from '../../domain/jwt/jwt-auth.guard';
import { EnumScopes } from '../../domain/enumerators/enum-scopes.enum';
import { Scopes } from '../../domain/decorator/scopes.decorator';

@ApiTags('neighborhoods')
@Controller('neighborhoods')
export class NeighborhoodsController extends AbstractController {
  constructor(
    private readonly getNeighborhoodsByCityService: NeighborhoodsByCityService,
    private readonly getNeighborhoodsByStateService: GetNeighborhoodsByStateService
  ) {
    super();
  }

  @ApiOperation({
    description: 'Get Neighborhoods By City Reference'
  })
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
  @UseGuards(JwtAuthGuard)
  @Scopes(EnumScopes.GET_ALL)
  @Get('/city/:country/:state/:city')
  async getNeighborhoodsByCity(
    @Param() params: SearchNeighborhoodsDTO
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getNeighborhoodsByCityService.getFindAndSeedElements(params)
    );
  }

  @ApiOperation({
    description: 'Get Neighborhoods By State Reference'
  })
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
  @UseGuards(JwtAuthGuard)
  @Scopes(EnumScopes.GET_ALL)
  @Get('/state/:country/:state')
  async getNeighborhoodsByState(
    @Param() params: SearchNeighborhoodsDTO
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getNeighborhoodsByStateService.getNeighborhoodsByState(params)
    );
  }
}
