import { Injectable } from '@nestjs/common';
import { LogActionsMongoose } from '../../../adapter/repository/logactions/logactions-mongoose.repository';
import { DateHelper } from '../../../adapter/helper/date.helper';
import { EnumTypeAction } from '../../enumerators/enum-type-action';
import { Reference } from '../../model/references/reference.model';
import { MongooseDocumentID } from '../../repository/mongoose/mongoose.repository';
import { LogAction } from '../../schemas/logaction.schema';
import { AbstractService } from '../abstract-service.service';

@Injectable()
export class LogActionService extends AbstractService {
  constructor(protected readonly mongoRepository: LogActionsMongoose) {
    super();
  }

  async saveLogAction(
    type: EnumTypeAction,
    reference: Reference,
    idLogExecution: MongooseDocumentID
  ) {
    const log = new LogAction();
    log.datetime = DateHelper.getDateNow();
    log.idLogExecution = idLogExecution;
    log.type = type;
    log.reference = reference;
    return this.mongoRepository.insertOne(log, 'log execution');
  }
}
