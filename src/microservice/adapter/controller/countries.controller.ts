import { Controller, Get, HttpStatus } from '@nestjs/common';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { GetCountriesService } from '../../domain/service/countries/get-countries.service';

@Controller('countries')
export class CountriesController extends AbstractController {
  constructor(private readonly getCountriesService: GetCountriesService) {
    super();
  }

  @Get('/')
  async getAllCountries(): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getCountriesService.getAll()
    );
  }
}
