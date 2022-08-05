import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { DateHelper } from '../../../adapter/helper/date.helper';
import { LogExecutionMongoose } from '../../../adapter/repository/logexecutions/logexecution-mongoose.repository';
import { EnumTypeLogExecution } from '../../enumerators/enum-type-logexecution';
import { Reference } from '../../model/references/reference.model';
import { LogExecution } from '../../schemas/logexecution.schema';
import { AbstractService } from '../abstract-service.service';

@Injectable()
export class LogExecutionService extends AbstractService {
  constructor(protected readonly mongoRepository: LogExecutionMongoose) {
    super();
  }

  async saveLogExecution(type: EnumTypeLogExecution, reference: Reference) {
    const log = new LogExecution();
    log.datetime = DateHelper.getDateNow();
    log.ip = 'localhost';
    log.type = type;
    log.reference = reference;
    return this.mongoRepository.insertOne(log, 'log execution');
  }

  async finishLogExecution(id: string | ObjectId) {
    return this.mongoRepository.updateOneById(id, {
      processedDate: DateHelper.getDateNow()
    });
  }
}
