import { EnumTranslations } from '../../../src/microservice/domain/enumerators/enum-translations.enumerator';
import { Translations } from '../../../src/microservice/domain/model/translations.model';
import { City } from '../../../src/microservice/domain/schemas/city.schema';
import { Country } from '../../../src/microservice/domain/schemas/country.schema';
import { State } from '../../../src/microservice/domain/schemas/state.schema';

export const mockConvertedSearchOrleans = () => {
  const country = new Country();
  country.id = 31;
  country.name = 'Brazil';
  country.translations = new Translations();
  country.translations[EnumTranslations.BR] = 'brasil';
  const state = new State();
  state.id = 2014;
  state.name = 'Santa Catarina';
  state.stateCode = 'SC';
  const city = new City();
  city.id = 1;
  city.name = 'Orleans';

  return { country, city, state };
};
