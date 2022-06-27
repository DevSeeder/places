import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CountryResponse } from 'src/microservice/domain/model/countries/country-response.model';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { GetCountriesService } from '../../domain/service/countries/get-countries.service';

@ApiTags('countries')
@Controller('countries')
export class CountriesController extends AbstractController {
  constructor(private readonly getCountriesService: GetCountriesService) {
    super();
  }

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
