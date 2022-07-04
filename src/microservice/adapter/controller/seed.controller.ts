import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SearchNeighborhoodsDTO } from '../../domain/model/search/neighborhoods/search-neighborhoods-dto.model';
import { SeedNeighborhoodsByStateService } from '../../domain/service/seed/seed-neighborhoods-by-state.service';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { SenderMessageService } from '../../domain/service/amqp/sender-message.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ConfigHelper, EnumConfigAMQP } from '../helper/config/config.helper';

const EVENT_PATTERN_SEED_BY_CITY = ConfigHelper.getConfig(
  'seed.neighborhoods.by.city.process',
  EnumConfigAMQP.EVENT
);

@ApiExcludeController()
@Controller('seed')
export class SeedController extends AbstractController {
  constructor(
    private readonly seedNeighborhoodsByStateService: SeedNeighborhoodsByStateService,
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

  @Get('/sendEvent')
  async seedEvent(): Promise<NestResponse> {
    const msg = {
      city: 'ORL'
    };
    return this.buildResponse(
      HttpStatus.OK,
      await this.senderMessageService.emmitEvent(
        'seed.neighborhoods.by.city.process',
        msg
      )
    );
  }

  @EventPattern(EVENT_PATTERN_SEED_BY_CITY)
  async getNotifications(@Payload() data: object, @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`);
    console.log(`Payload: ${data}`);
  }
}
