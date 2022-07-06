import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SearchNeighborhoodsDTO } from '../../domain/model/search/neighborhoods/search-neighborhoods-dto.model';
import { SeedNeighborhoodsByStateService } from '../../domain/service/seed/seed-neighborhoods-by-state.service';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { SenderMessageService } from '../../domain/service/amqp/sender-message.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ConfigHelper, EnumConfigAMQP } from '../helper/config/config.helper';
import { EventSeedByCityDTO } from '../../domain/model/dto/events/event-seed-by-city-dto.model';
import { SeedNeighborhoodsByCityService } from '../../domain/service/seed/seed-neighborhoods-by-city.service';

const EVENT_PATTERN_SEED_BY_CITY = ConfigHelper.getConfig(
  'seed.neighborhoods.by.city',
  EnumConfigAMQP.EVENT
);

@ApiExcludeController()
@Controller('seed')
export class SeedController extends AbstractController {
  constructor(
    private readonly seedNeighborhoodsByStateService: SeedNeighborhoodsByStateService,
    private readonly seedNeighborhoodsByCityService: SeedNeighborhoodsByCityService,
    private readonly senderMessageService: SenderMessageService,
    private configService: ConfigService
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

  @Post('/sendEvent')
  async seedEvent(@Body() msg: EventSeedByCityDTO): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.senderMessageService.emitEvent(
        'seed.neighborhoods.by.city',
        msg
      )
    );
  }

  @EventPattern(EVENT_PATTERN_SEED_BY_CITY)
  async seedNeighborhoodsByCity(@Payload() data: EventSeedByCityDTO) {
    this.seedNeighborhoodsByCityService.seedNeighborhoodsByCity(data);
  }

  @Post('/pubMsg')
  async pubMsg(@Body() msg: EventSeedByCityDTO): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.senderMessageService.publishMessage(
        'seed.neighborhoods.by.city.success',
        msg
      )
    );
  }
}
