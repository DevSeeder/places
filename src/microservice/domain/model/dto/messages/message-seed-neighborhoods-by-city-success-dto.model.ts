import { ReferenceEventByCity } from '../../references/reference-event-by-city.model';
import { EventSeedByCityDTO } from '../events/event-seed-by-city-dto.model';

export class MessageSeedNeighborhoodsByCitySuccessDTO extends EventSeedByCityDTO {
  constructor(
    public seededCount: number,
    public dateTime: Date,
    public reference: ReferenceEventByCity
  ) {
    super(dateTime, reference);
  }
}
