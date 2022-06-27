import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { GetCitiesByStateService } from '../../domain/service/cities/get/get-cities-by-state.service';
import { SearchCitiesInput } from '../../domain/model/search/cities/search-cities-input.model';
import { GetCitiesByCountryService } from 'src/microservice/domain/service/cities/get/get-cities-by-country.service';

@Controller('cities')
export class CitiesController extends AbstractController {
  constructor(
    private readonly getCitiesByStateService: GetCitiesByStateService,
    private readonly getCitiesByCountryService: GetCitiesByCountryService
  ) {
    super();
  }

  @Get('/state/:country/:state')
  async getNeighborhoodsByState(
    @Param() params: SearchCitiesInput
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getCitiesByStateService.getCitiesByState(params)
    );
  }

  @Get('/country/:country')
  async getNeighborhoodsByCountry(
    @Param('country') country: string
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getCitiesByCountryService.getCitiesByCountry(country)
    );
  }
}
