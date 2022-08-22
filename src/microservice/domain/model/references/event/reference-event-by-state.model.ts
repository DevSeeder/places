import { Reference } from '../reference.model';

export class ReferenceEventByState extends Reference {
  country: string;
  countryId: number;
  stateId: number;
  stateCode: string;
  stateName: string;
}
