import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SearchNeighborhoodsDTO } from '../../domain/model/search/neighborhoods/search-neighborhoods-dto.model';
import { SeedNeighborhoodsByStateService } from '../../domain/service/seed/neighborhoods/seed-neighborhoods-by-state.service';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { SenderMessageService } from '../../domain/service/amqp/sender-message.service';
import { EventSeedByCityDTO } from '../../domain/model/dto/events/event-seed-by-city-dto.model';

@ApiExcludeController()
@Controller('seed')
export class SeedController extends AbstractController {
  constructor(
    private readonly seedNeighborhoodsByStateService: SeedNeighborhoodsByStateService,
    private readonly senderMessageService: SenderMessageService
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

  /* istanbul ignore next */
  @Post('/pubMsg')
  async pubMsg(@Body() msg: EventSeedByCityDTO): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.senderMessageService.publishMessage(
        'seed.neighborhoods.by.city.process',
        msg
      )
    );
  }
}
