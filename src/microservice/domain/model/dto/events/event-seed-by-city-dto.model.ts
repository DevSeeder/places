import { ReferenceEventByCity } from '../../references/event/reference-event-by-city.model';

export class EventSeedByCityDTO {
  constructor(public dateTime: Date, public reference: ReferenceEventByCity) {}
}
