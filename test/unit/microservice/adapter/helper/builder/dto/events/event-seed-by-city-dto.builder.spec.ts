import '../../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { Country } from '../../../../../../../../src/microservice/domain/schemas/country.schema';
import { State } from '../../../../../../../../src/microservice/domain/schemas/state.schema';
import { City } from '../../../../../../../../src/microservice/domain/schemas/city.schema';
import { EventSeedByCityDTOBuilder } from '../../../../../../../../src/microservice/adapter/helper/builder/dto/events/event-seed-by-city-dto.builder';
import { ReferenceEventByCity } from '../../../../../../../../src/microservice/domain/model/references/event/reference-event-by-city.model';
import { EnumTranslations } from '../../../../../../../../src/microservice/domain/enumerators/enum-translations.enumerator';
import { Translations } from '../../../../../../../../src/microservice/domain/model/translations.model';

const mockReference: ReferenceEventByCity = {
  country: 'USA',
  stateCode: 'NY',
  cityId: 1,
  cityName: 'New York City'
};

const mockConvertedSearch = () => {
  const mockCountry = new Country();
  mockCountry.name = 'USA';
  mockCountry.translations = new Translations();
  mockCountry.translations[EnumTranslations.BR] = 'USA';
  const mockState = new State();
  mockState.name = 'New York';
  mockState.stateCode = 'NY';
  const mockCity = new City();
  mockCity.name = 'New York City';
  mockCity.id = 1;
  return {
    country: mockCountry,
    state: mockState,
    city: mockCity
  };
};

describe('EventSeedByCityDTOBuilder ', () => {
  it('Should instanciate EventSeedByCityDTOBuilder and build correctly', function () {
    const nestBuilder = new EventSeedByCityDTOBuilder(mockConvertedSearch());
    const actual = nestBuilder.build(mockConvertedSearch().city);
    expect(JSON.stringify(actual.reference)).to.be.equal(
      JSON.stringify(mockReference)
    );
  });
});
