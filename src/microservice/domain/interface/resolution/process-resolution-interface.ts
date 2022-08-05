import { ReferenceResolution } from '../../model/references/reference-resolution.model';
import { LogSeed } from '../../schemas/logseed.schema';

export interface ProcessResolution {
  process(logSeed: LogSeed, resolution: ReferenceResolution);
}
