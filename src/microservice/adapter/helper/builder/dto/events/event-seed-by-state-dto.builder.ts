import { EventSeedByStateDTO } from '../../../../../domain/model/dto/events/event-seed-by-state-dto.model';
import { Builder } from '../../../../../domain/helper/builder/builder.builder';
import { DateHelper } from '../../../date.helper';
import { ReferenceEventByStateBuilder } from '../reference/reference-event-by-state.builder';
import { State } from '../../../../../domain/schemas/state.schema';
import { Country } from '../../../../../domain/schemas/country.schema';

export class EventSeedByStateDTOBuilder extends Builder<
  State,
  EventSeedByStateDTO
> {
  build(country: Country): EventSeedByStateDTO {
    const reference = new ReferenceEventByStateBuilder(this.inputElement).build(
      country
    );
    return new EventSeedByStateDTO(DateHelper.getDateNow(), reference);
  }
}
