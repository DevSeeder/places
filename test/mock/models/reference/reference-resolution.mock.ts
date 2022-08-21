import { EnumTypeResolution } from '../../../../src/microservice/domain/enumerators/enum-type-resolution';
import { ReferenceResolution } from '../../../../src/microservice/domain/model/references/reference-resolution.model';

export const mockRefResolution = (): ReferenceResolution => {
  const refRes = new ReferenceResolution();
  refRes.type = EnumTypeResolution.IsNotACity;
  refRes.idLogSeed = null;
  refRes.dataResolution = 'any';
  return refRes;
};
