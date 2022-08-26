import { HttpStatus, Injectable } from '@nestjs/common';
import { NotFoundException } from '../../../../core/error-handling/exception/not-found.exception';
import { EnumTypeLogExecution } from '../../enumerators/enum-type-logexecution';
import { ReferenceResolution } from '../../model/references/reference-resolution.model';
import { MongooseDocumentID } from '../../repository/mongoose/mongoose.repository';
import { LogSeed } from '../../schemas/logseed.schema';
import { AbstractService } from '../abstract-service.service';
import { LogExecutionService } from '../logexecutions/log-execution.service';
import { GetLogSeedByIdService } from '../logseed/get-log-seed-by-id.service';
import { LogSeedJobService } from '../logseed/log-seed-job.service';
import { ProcessResolutionWrongCityNameService } from './process/city/process-resolution-wrong-city-name.service';
import { ProcessResolutionIsNotACityService } from './process/city/process-resolution-is-not-a-city.service';
import { ResolutionException } from '../../../../core/error-handling/exception/resolution.exception';
import { ProcessResolutionUniqueNeighborhoodService } from './process/city/process-resolution-unique-neighborhood.service';

@Injectable()
export class ResolutionService extends AbstractService {
  constructor(
    protected readonly logExecutionService: LogExecutionService,
    protected readonly logSeedService: LogSeedJobService,
    protected readonly getLogSeedService: GetLogSeedByIdService,
    protected readonly processIsNotACityService: ProcessResolutionIsNotACityService,
    protected readonly processWrongCityNameService: ProcessResolutionWrongCityNameService,
    protected readonly processUniqueNeighborhoodService: ProcessResolutionUniqueNeighborhoodService
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

    try {
      await this.startResolution(resolution, idLogExecution);
    } catch (err) {
      await this.logExecutionService.finishLogExecution(
        idLogExecution,
        err.message
      );
      this.logger.error(err.message);
      throw err;
    }

    await this.logExecutionService.finishLogExecution(idLogExecution);

    return {
      success: true,
      response: 'Resolution Processed!'
    };
  }

  async startResolution(
    resolution: ReferenceResolution,
    idLogExecution: MongooseDocumentID
  ): Promise<void> {
    this.logger.log(`Searching logSeed by id '${resolution.idLogSeed}'`);

    const logSeed = await this.getLogSeedService.getLogSeedById(
      resolution.idLogSeed
    );

    if (!logSeed) throw new NotFoundException('LogSeed');

    if (logSeed.processed) {
      throw new ResolutionException(
        'LogSeed Already Processed!',
        HttpStatus.BAD_REQUEST
      );
    }

    const resultProccess = await this.processResolution(
      logSeed,
      resolution,
      idLogExecution
    );

    if (!resultProccess) return;

    await this.logSeedService.logProcessResolution(
      resolution.idLogSeed,
      resolution.type
    );
  }

  async processResolution(
    logSeed: LogSeed,
    resolution: ReferenceResolution,
    idLogExecution: MongooseDocumentID
  ): Promise<boolean> {
    this.logger.log('Processing resolution...');

    const processService = `process${resolution.type}Service`;

    if (this.hasOwnProperty(processService))
      await this[processService].process(logSeed, resolution, idLogExecution);
    else {
      this.logger.warn(
        `No resolution process implemented for ${resolution.type}`
      );
    }

    this.logger.log(`Resolution Finished...`);

    return this.hasOwnProperty(processService);
  }
}
