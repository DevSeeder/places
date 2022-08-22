import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { RegionsByCountryService } from '../../domain/service/regions/regions-by-country.service';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { SearchRegionsDTO } from '../../domain/model/search/regions/search-regions-dto.model';

@ApiExcludeController()
@Controller('regions')
export class RegionsController extends AbstractController {
  constructor(
    private readonly getRegionsByCountryService: RegionsByCountryService
  ) {
    super();
  }

  @Get('country/:country')
  async getRegionsByCountry(
    @Param() params: SearchRegionsDTO
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getRegionsByCountryService.getFindAndSeedElements(params)
    );
  }
}
