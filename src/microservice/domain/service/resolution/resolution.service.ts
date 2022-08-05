import { Injectable } from '@nestjs/common';
import { EnumTypeLogExecution } from '../../enumerators/enum-type-logexecution';
import { EnumTypeResolution } from '../../enumerators/enum-type-resolution';
import { ReferenceResolution } from '../../model/references/reference-resolution.model';
import { MongooseDocumentID } from '../../repository/mongoose/mongoose.repository';
import { LogSeed } from '../../schemas/logseed.schema';
import { AbstractService } from '../abstract-service.service';
import { LogExecutionService } from '../logexecutions/log-execution.service';
import { GetLogSeedByIdService } from '../logseed/get-log-seed-by-id.service';
import { LogSeedJobService } from '../logseed/log-seed-job.service';
import { ProcessResolutionIsNotACityService } from './process/process-resolution-is-not-a-city.service';

@Injectable()
export class ResolutionService extends AbstractService {
  constructor(
    protected readonly logExecutionService: LogExecutionService,
    protected readonly logSeedService: LogSeedJobService,
    protected readonly getLogSeedService: GetLogSeedByIdService,
    protected readonly processIsNotACityService: ProcessResolutionIsNotACityService
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

    const logSeed = await this.getLogSeedService.getLogSeedById(
      resolution.idLogSeed
    );

    await this.processResolution(logSeed, resolution, idLogExecution);

    await this.logExecutionService.finishLogExecution(idLogExecution);
  }

  async processResolution(
    logSeed: LogSeed,
    resolution: ReferenceResolution,
    idLogExecution: MongooseDocumentID
  ): Promise<void> {
    this.logger.log('Processing resolution...');
    if (resolution.type == EnumTypeResolution.IsNotACity) {
      await this.processIsNotACityService.process(
        logSeed,
        resolution,
        idLogExecution
      );
    }
    this.logger.log(`Resolution Finished...`);
  }
}
