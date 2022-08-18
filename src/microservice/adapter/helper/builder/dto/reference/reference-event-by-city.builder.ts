import { Builder } from '../../../../../domain/helper/builder/builder.builder';
import { ValidOutputSearchByState } from '../../../../../domain/interface/valid-output-search/valid-outpu-search.interface';
import { City } from '../../../../../domain/schemas/city.schema';
import { ReferenceEventByCity } from '../../../../../domain/model/references/event/reference-event-by-city.model';
import { EnumTranslations } from '../../../../../domain/enumerators/enum-translations.enumerator';
import { Country } from '../../../../../domain/schemas/country.schema';
import { State } from '../../../../../domain/schemas/state.schema';

type TypeInputBuild =
  | ValidOutputSearchByState
  | { country: Partial<Country>; state: Partial<State> };

export class ReferenceEventByCityBuilder extends Builder<
  TypeInputBuild,
  ReferenceEventByCity
> {
  build(buildParams: Partial<City>): ReferenceEventByCity {
    const reference = new ReferenceEventByCity();
    reference.country =
      this.inputElement.country.translations[EnumTranslations.BR];
    reference.stateCode = this.inputElement.state.stateCode;
    reference.cityId = buildParams.id;
    reference.cityName = buildParams.name;
    return reference;
  }
}
