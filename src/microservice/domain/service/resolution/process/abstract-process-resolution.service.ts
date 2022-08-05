import { Injectable } from '@nestjs/common';
import { EnumTypeAction } from '../../../enumerators/enum-type-action';
import { ReferenceResolution } from '../../../model/references/reference-resolution.model';
import { MongooseDocumentID } from '../../../repository/mongoose/mongoose.repository';
import { LogSeed } from '../../../schemas/logseed.schema';
import { AbstractService } from '../../abstract-service.service';
import { LogActionService } from '../../logactions/log-action.service';

@Injectable()
export abstract class AbstractProcessResolution extends AbstractService {
  constructor(
    protected readonly logActionService: LogActionService,
    protected readonly actionType: EnumTypeAction
  ) {
    super();
  }

  async process(
    logSeed: LogSeed,
    _resolution: ReferenceResolution,
    idLogExecution?: MongooseDocumentID
  ) {
    await this.logActionService.saveLogAction(
      this.actionType,
      logSeed.reference,
      idLogExecution
    );
  }
}
