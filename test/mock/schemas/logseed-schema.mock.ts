import { ReferenceNeighborhoodsByState } from '../../../src/microservice/domain/model/references/reference-neighborhoods-by-state.model';
import { LogSeed } from '../../../src/microservice/domain/schemas/logseed.schema';

export const mockLogSeed = (): LogSeed => {
  const log = new LogSeed();
  log.reference = new ReferenceNeighborhoodsByState(
    31,
    1,
    5,
    'Brazil',
    'Santa Catarina',
    'Chapecó'
  );

  return log;
};
