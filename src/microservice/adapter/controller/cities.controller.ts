import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { GetCitiesByStateService } from '../../domain/service/cities/get-cities-by-state.service';
import { SearchCitiesInput } from 'src/microservice/domain/model/search/cities/search-cities-input.model';

@Controller('cities')
export class CitiesController extends AbstractController {
  constructor(
    private readonly getCitiesByCityService: GetCitiesByStateService
  ) {
    super();
  }

  @Get('/state/:country/:state')
  async getNeighborhoodsByState(
    @Param() params: SearchCitiesInput
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.getCitiesByCityService.getCitiesByState(params)
    );
  }
}
