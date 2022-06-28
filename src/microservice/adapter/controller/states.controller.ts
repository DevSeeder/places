import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { GetStatesByCountryService } from '../../domain/service/states/get-states-by-country.service';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { StatesByCountry } from '../../domain/model/states/states-by-country.model';

@ApiTags('states')
@Controller('states')
export class StatesController extends AbstractController {
  constructor(
    private readonly getStatesByCountryService: GetStatesByCountryService
  ) {
    super();
  }

  @ApiOkResponse({
    description: 'States found.',
    isArray: true,
    type: StatesByCountry
  })
  @ApiParam({
    name: 'country',
    required: true,
    description: 'The Country name of the state',
    type: String
  })
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
