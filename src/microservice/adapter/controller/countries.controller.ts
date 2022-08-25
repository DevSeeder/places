import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountryResponse } from '../../domain/model/countries/country-response.model';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { GetCountriesService } from '../../domain/service/countries/get-countries.service';

@ApiTags('countries')
@Controller('countries')
export class CountriesController extends AbstractController {
  constructor(private readonly getCountriesService: GetCountriesService) {
    super();
  }

  @ApiOperation({
    description: 'Get All Countries'
  })
  @ApiOkResponse({
    description: 'Countries found.',
    isArray: true,
    type: CountryResponse
  })
  @Get('/')
  async getAllCountries(): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getCountriesService.getAll()
    );
  }
}
