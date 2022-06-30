import { Controller, Get, HttpStatus, Inject, Param } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SearchNeighborhoodsDTO } from '../../domain/model/search/neighborhoods/search-neighborhoods-dto.model';
import { SeedNeighborhoodsByStateService } from '../../domain/service/seed/seed-neighborhoods-by-state.service';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { ClientProxy } from '@nestjs/microservices';

@ApiExcludeController()
@Controller('seed')
export class SeedController extends AbstractController {
  constructor(
    private readonly seedNeighborhoodsByStateService: SeedNeighborhoodsByStateService,
    @Inject('CLIENT_AMQP_SERVICE') private client: ClientProxy
  ) {
    super();
  }

  @Get('/state/:country/:state')
  async seedNeighborhoodsByState(
    @Param() params: SearchNeighborhoodsDTO
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.seedNeighborhoodsByStateService.seedNeighborhoodsByState(
        params
      )
    );
  }

  @Get('/sendEvent')
  async seedEvent(): Promise<NestResponse> {
    const msg = {
      city: 'POA'
    };
    await this.client.emit('seed-by-city', msg);
    return this.buildResponse(HttpStatus.OK, {
      success: true,
      response: 'EVENT SENT'
    });
  }
}
