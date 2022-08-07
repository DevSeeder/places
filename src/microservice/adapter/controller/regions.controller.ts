import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { SeedRegionsByCountryService } from 'src/microservice/domain/service/seed/regions/seed-regions-by-country.service';
import { SearchRegionsDTO } from 'src/microservice/domain/model/search/regions/search-regions-dto.model';

@ApiExcludeController()
@Controller('regions')
export class RegionsController extends AbstractController {
  constructor(
    private readonly seedRegionsByCountryService: SeedRegionsByCountryService
  ) {
    super();
  }

  @Get('/seed/:country')
  async seedNeighborhoodsByState(
    @Param() params: SearchRegionsDTO
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.seedRegionsByCountryService.seedRegionsByCountry(params)
    );
  }
}
