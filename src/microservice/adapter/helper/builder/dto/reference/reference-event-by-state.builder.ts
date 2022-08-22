import { Country } from '../../../../../domain/schemas/country.schema';
import { State } from '../../../../../domain/schemas/state.schema';
import { Builder } from '../../../../../domain/helper/builder/builder.builder';
import { ReferenceEventByState } from '../../../../../domain/model/references/event/reference-event-by-state.model';

export class ReferenceEventByStateBuilder extends Builder<
  State,
  ReferenceEventByState
> {
  build(country: Country): ReferenceEventByState {
    const reference = new ReferenceEventByState();
    reference.countryId = country.id;
    reference.country = country.name;
    reference.stateId = this.inputElement.id;
    reference.stateName = this.inputElement.name;
    reference.stateCode = this.inputElement.stateCode;
    return reference;
  }
}
