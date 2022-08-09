import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { SearchRegionsDTO } from '../../domain/model/search/regions/search-regions-dto.model';
import { GetRegionsByCountryService } from '../../domain/service/regions/get-regions-by-country.service';

@ApiExcludeController()
@Controller('regions')
export class RegionsController extends AbstractController {
  constructor(
    private readonly getRegionsByCountryService: GetRegionsByCountryService
  ) {
    super();
  }

  @Get('/:country')
  async seedNeighborhoodsByState(
    @Param() params: SearchRegionsDTO
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getRegionsByCountryService.getRegionsByCountry(params)
    );
  }
}
