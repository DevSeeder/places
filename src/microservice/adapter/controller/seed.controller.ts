import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SearchNeighborhoodsDTO } from '../../domain/model/search/neighborhoods/search-neighborhoods-dto.model';
import { SeedNeighborhoodsByStateService } from '../../domain/service/seed/neighborhoods/seed-neighborhoods-by-state.service';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { SenderMessageService } from '../../domain/service/amqp/sender-message.service';
import { EventSeedByCityDTO } from '../../domain/model/dto/events/event-seed-by-city-dto.model';
import { SeedNeighborhoodsByCountryService } from '../../domain/service/seed/neighborhoods/seed-neighborhoods-by-country.service';
import { JwtAuthGuard } from '../../domain/jwt/jwt-auth.guard';
import { EnumScopes } from '../../domain/enumerators/enum-scopes.enum';
import { Scopes } from '../../domain/decorator/scopes.decorator';

@ApiExcludeController()
@Controller('seed')
export class SeedController extends AbstractController {
  constructor(
    private readonly seedNeighborhoodsByStateService: SeedNeighborhoodsByStateService,
    private readonly seedNeighborhoodsByCountryService: SeedNeighborhoodsByCountryService,
    private readonly senderMessageService: SenderMessageService
  ) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Scopes(EnumScopes.SEED_ALL)
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

  @UseGuards(JwtAuthGuard)
  @Scopes(EnumScopes.SEED_ALL)
  @Get('/country/:country')
  async seedNeighborhoodsByCountry(
    @Param('country') country: string
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.seedNeighborhoodsByCountryService.seedNeighborhoodsByCountry(
        country
      )
    );
  }

  /* istanbul ignore next */
  @UseGuards(JwtAuthGuard)
  @Scopes(EnumScopes.ADM_PLACES)
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
