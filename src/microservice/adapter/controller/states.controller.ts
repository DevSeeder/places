import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { GetStateByCountryService } from '../../domain/service/states/get-states-by-country.service';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';

@Controller('states')
export class StatesController extends AbstractController {
  constructor(
    private readonly getStatesByCountryService: GetStateByCountryService
  ) {
    super();
  }

  @Get('/country/:country')
  async getStatesByCountry(
    @Param('country') country: string
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getStatesByCountryService.getStatesByCountry(country)
    );
  }
}
