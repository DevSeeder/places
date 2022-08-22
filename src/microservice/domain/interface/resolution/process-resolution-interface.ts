import { ReferenceResolution } from '../../model/references/reference-resolution.model';
import { Reference } from '../../model/references/reference.model';
import { MongooseDocumentID } from '../../repository/mongoose/mongoose.repository';
import { LogSeed } from '../../schemas/logseed.schema';

export interface ProcessResolution<ReferenceType> {
  process(
    logSeed: LogSeed,
    resolution: ReferenceResolution,
    idLogExecution: MongooseDocumentID
  );

  getReference(reference: Reference): ReferenceType;
}
