import { Builder } from '../../../../domain/helper/builder/builder.builder';
import { ValidOutputSearchByState } from '../../../../domain/interface/valid-output-search/valid-outpu-search.interface';
import { EventSeedByCityDTO } from '../../../../domain/model/dto/events/event-seed-by-city-dto.model';
import { City } from '../../../../domain/schemas/city.schema';
import { ReferenceEventByCity } from '../../../../domain/model/references/reference-event-by-city.model';
import { EnumTranslations } from '../../../../domain/enumerators/enum-translations.enumerator';

export class EventSeedByCityDTOBuilder extends Builder<
  ValidOutputSearchByState,
  EventSeedByCityDTO
> {
  build(buildParams: City): EventSeedByCityDTO {
    const reference = new ReferenceEventByCity();
    reference.country =
      this.inputElement.country.translations[EnumTranslations.BR];
    reference.stateCode = this.inputElement.state.stateCode;
    reference.cityId = buildParams.id;
    reference.cityName = buildParams.name;

    return new EventSeedByCityDTO(new Date(), reference);
  }
}
