import { Injectable } from '@nestjs/common';
import { NotFoundException } from '../../../../core/error-handling/exception/not-found.exception';
import { EnumTypeLogExecution } from '../../enumerators/enum-type-logexecution';
import { EnumTypeResolution } from '../../enumerators/enum-type-resolution';
import { ReferenceResolution } from '../../model/references/reference-resolution.model';
import { MongooseDocumentID } from '../../repository/mongoose/mongoose.repository';
import { LogSeed } from '../../schemas/logseed.schema';
import { AbstractService } from '../abstract-service.service';
import { LogExecutionService } from '../logexecutions/log-execution.service';
import { GetLogSeedByIdService } from '../logseed/get-log-seed-by-id.service';
import { LogSeedJobService } from '../logseed/log-seed-job.service';
import { ProcessResolutionWrongCityNameService } from './process/city/process-resolution-wrong-city-name.service';
import { ProcessResolutionIsNotACityService } from './process/city/process-resolution-is-not-a-city.service';
import { ProcessResolution } from '../../interface/resolution/process-resolution-interface';
import { Reference } from '../../model/references/reference.model';

@Injectable()
export class ResolutionService extends AbstractService {
  constructor(
    protected readonly logExecutionService: LogExecutionService,
    protected readonly logSeedService: LogSeedJobService,
    protected readonly getLogSeedService: GetLogSeedByIdService,
    protected readonly processIsNotACityService: ProcessResolutionIsNotACityService,
    protected readonly processWrongCityNameService: ProcessResolutionWrongCityNameService
  ) {
    super();
  }

  async requestResolution(resolution: ReferenceResolution) {
    this.logger.log(
      `Requesting resolution ${resolution.type} - Seed[${resolution.idLogSeed}]`
    );
    const idLogExecution = await this.logExecutionService.saveLogExecution(
      EnumTypeLogExecution.Resolution,
      resolution
    );

    this.logger.log(`Searching logSeed by id '${resolution.idLogSeed}'`);

    const logSeed = await this.getLogSeedService.getLogSeedById(
      resolution.idLogSeed
    );

    if (!logSeed) throw new NotFoundException('LogSeed');

    await this.processResolution(logSeed, resolution, idLogExecution);

    await this.logSeedService.logProcessResolution(
      resolution.idLogSeed,
      resolution.type
    );

    await this.logExecutionService.finishLogExecution(idLogExecution);

    return {
      success: true,
      response: 'Resolution Processed!'
    };
  }

  async processResolution(
    logSeed: LogSeed,
    resolution: ReferenceResolution,
    idLogExecution: MongooseDocumentID
  ): Promise<void> {
    this.logger.log('Processing resolution...');

    let processService: ProcessResolution<Reference> = null;

    switch (resolution.type) {
      case EnumTypeResolution.IsNotACity:
        processService = this.processIsNotACityService;
        break;
      case EnumTypeResolution.WrongCityName:
        processService = this.processWrongCityNameService;
        break;
      default:
        this.logger.warn(
          `No resolution process implemented for ${resolution.type}`
        );
        break;
    }

    if (processService)
      processService.process(logSeed, resolution, idLogExecution);

    this.logger.log(`Resolution Finished...`);
  }
}
