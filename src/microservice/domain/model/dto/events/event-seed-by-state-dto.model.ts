import { ReferenceEventByState } from '../../references/event/reference-event-by-state.model';

export class EventSeedByStateDTO {
  constructor(public dateTime: Date, public reference: ReferenceEventByState) {}
}
