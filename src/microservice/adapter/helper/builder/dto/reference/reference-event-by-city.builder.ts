import { Builder } from '../../../../../domain/helper/builder/builder.builder';
import { ValidOutputSearchByState } from '../../../../../domain/interface/valid-output-search/valid-outpu-search.interface';
import { City } from '../../../../../domain/schemas/city.schema';
import { ReferenceEventByCity } from '../../../../../domain/model/references/reference-event-by-city.model';
import { EnumTranslations } from '../../../../../domain/enumerators/enum-translations.enumerator';

export class ReferenceEventByCityBuilder extends Builder<
  ValidOutputSearchByState,
  ReferenceEventByCity
> {
  build(buildParams: City): ReferenceEventByCity {
    const reference = new ReferenceEventByCity();
    reference.country =
      this.inputElement.country.translations[EnumTranslations.BR];
    reference.stateCode = this.inputElement.state.stateCode;
    reference.cityId = buildParams.id;
    reference.cityName = buildParams.name;
    return reference;
  }
}
