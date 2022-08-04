import { Builder } from '../../../../../domain/helper/builder/builder.builder';
import { ValidOutputSearchByState } from '../../../../../domain/interface/valid-output-search/valid-outpu-search.interface';
import { EventSeedByCityDTO } from '../../../../../domain/model/dto/events/event-seed-by-city-dto.model';
import { City } from '../../../../../domain/schemas/city.schema';
import { ReferenceEventByCityBuilder } from '../reference/reference-event-by-city.builder';

export class EventSeedByCityDTOBuilder extends Builder<
  ValidOutputSearchByState,
  EventSeedByCityDTO
> {
  build(buildParams: City): EventSeedByCityDTO {
    const reference = new ReferenceEventByCityBuilder(this.inputElement).build(
      buildParams
    );
    return new EventSeedByCityDTO(new Date(), reference);
  }
}
