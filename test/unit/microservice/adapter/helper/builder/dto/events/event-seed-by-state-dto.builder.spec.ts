import '../../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { Country } from '../../../../../../../../src/microservice/domain/schemas/country.schema';
import { State } from '../../../../../../../../src/microservice/domain/schemas/state.schema';
import { City } from '../../../../../../../../src/microservice/domain/schemas/city.schema';
import { EnumTranslations } from '../../../../../../../../src/microservice/domain/enumerators/enum-translations.enumerator';
import { Translations } from '../../../../../../../../src/microservice/domain/model/translations.model';
import { ReferenceEventByState } from '../../../../../../../../src/microservice/domain/model/references/event/reference-event-by-state.model';
import { EventSeedByStateDTOBuilder } from '../../../../../../../../src/microservice/adapter/helper/builder/dto/events/event-seed-by-state-dto.builder';
const mockReference: ReferenceEventByState = {
  countryId: 1,
  country: 'USA',
  stateId: 1,
  stateName: 'New York',
  stateCode: 'NY'
};

const mockConvertedSearch = () => {
  const mockCountry = new Country();
  mockCountry.id = 1;
  mockCountry.name = 'USA';
  mockCountry.translations = new Translations();
  mockCountry.translations[EnumTranslations.BR] = 'USA';
  const mockState = new State();
  mockState.id = 1;
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

describe('EventSeedByStateDTOBuilder ', () => {
  it('Should instanciate EventSeedByStateDTOBuilder and build correctly', function () {
    const nestBuilder = new EventSeedByStateDTOBuilder(
      mockConvertedSearch().state
    );
    const actual = nestBuilder.build(mockConvertedSearch().country);
    expect(JSON.stringify(actual.reference)).to.be.equal(
      JSON.stringify(mockReference)
    );
  });
});
