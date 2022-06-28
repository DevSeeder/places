import { Builder } from '../../../../domain/helper/builder/builder.builder';
import { CitiesByCountry } from '../../../../domain/model/cities/cities-by-country.model';
import { City } from '../../../../domain/schemas/city.schema';

export class CitiesByCountryBuilder extends Builder<City[], CitiesByCountry> {
  constructor(inputElement: City[]) {
    super(inputElement);
  }

  build(): CitiesByCountry {
    const builtElement = new CitiesByCountry();
    for (const item of this.inputElement) {
      const keyState = `${item.stateName.capitalize()} - ${item.stateCode.toUpperCase()}`;
      if (!Object.keys(builtElement).includes(keyState))
        builtElement[keyState] = [];

      delete item.stateName;
      builtElement[keyState].push(item);
    }

    return builtElement;
  }
}
