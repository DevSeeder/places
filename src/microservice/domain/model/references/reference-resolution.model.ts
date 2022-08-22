import { EnumTypeResolution } from '../../enumerators/enum-type-resolution';
import { Reference } from './reference.model';

export class ReferenceResolution extends Reference {
  idLogSeed: string;
  type: EnumTypeResolution;
  dataResolution: any;
}
