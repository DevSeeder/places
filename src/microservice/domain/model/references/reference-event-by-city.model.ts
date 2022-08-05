import { Reference } from './reference.model';

export class ReferenceEventByCity extends Reference {
  country: string;
  stateCode: string;
  cityId: number;
  cityName: string;
}
