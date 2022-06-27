import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { GetCitiesByStateService } from '../../domain/service/cities/get/get-cities-by-state.service';
import { SearchCitiesInput } from '../../domain/model/search/cities/search-cities-input.model';
import { GetCitiesByCountryService } from '../../domain/service/cities/get/get-cities-by-country.service';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { CitiesResponse } from '../../domain/model/cities/cities-by-state.model';

@ApiTags('cities')
@Controller('cities')
export class CitiesController extends AbstractController {
  constructor(
    private readonly getCitiesByStateService: GetCitiesByStateService,
    private readonly getCitiesByCountryService: GetCitiesByCountryService
  ) {
    super();
  }

  @ApiOkResponse({
    description: 'Cities found.',
    isArray: true,
    type: CitiesResponse
  })
  @ApiParam({
    name: 'country',
    required: true,
    description: 'The Country name of the city',
    type: String
  })
  @ApiParam({
    name: 'state',
    required: true,
    description: 'The State name of the city',
    type: String
  })
  @Get('/state/:country/:state')
  async getCitiesByState(
    @Param() params: SearchCitiesInput
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getCitiesByStateService.getCitiesByState(params)
    );
  }

  @ApiOkResponse({
    description: 'Cities found.',
    isArray: true,
    type: CitiesResponse
  })
  @ApiParam({
    name: 'country',
    required: true,
    description: 'The Country name of the city',
    type: String
  })
  @Get('/country/:country')
  async getCitiesByCountry(
    @Param('country') country: string
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getCitiesByCountryService.getCitiesByCountry(country)
    );
  }
}
