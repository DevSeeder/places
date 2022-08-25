import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountryResponse } from '../../domain/model/countries/country-response.model';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { GetCountriesService } from '../../domain/service/countries/get-countries.service';
import { JwtAuthGuard } from '../../domain/jwt/jwt-auth.guard';
import { EnumScopes } from '../../domain/enumerators/enum-scopes.enum';
import { Scopes } from '../../domain/decorator/scopes.decorator';

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
  @UseGuards(JwtAuthGuard)
  @Scopes(EnumScopes.GET_ALL)
  @Get('/')
  async getAllCountries(): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getCountriesService.getAll()
    );
  }
}
