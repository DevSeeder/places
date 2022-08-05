import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { NestResponse } from '../../../core/http/nest-response';
import { AbstractController } from '../../domain/controller/abstract-controller';
import { ApiExcludeController } from '@nestjs/swagger';
import { ReferenceResolution } from '../../domain/model/references/reference-resolution.model';
import { ResolutionService } from '../../domain/service/resolution/resolution.service';

@ApiExcludeController()
@Controller('resolutions')
export class ResolutionController extends AbstractController {
  constructor(private readonly resolutionService: ResolutionService) {
    super();
  }

  @Post('/request')
  async requestResolution(
    @Body() msg: ReferenceResolution
  ): Promise<NestResponse> {
    return this.buildResponse(
      HttpStatus.OK,
      await this.resolutionService.requestResolution(msg)
    );
  }
}
