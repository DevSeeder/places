import { Country } from '../../../../src/microservice/domain/schemas/country.schema';
import { mockState } from '../../schemas/state-schema.mock';

export const mockValidateService = {
  validateAndConvertSearchByState: () => {
    return {};
  },
  validateAndConvertSearchByCity: () => {
    return {};
  }
};

export const mockValidateCountryService = {
  validateCountry: () => {
    return new Country();
  }
};

export const mockValidateStateService = {
  validateState: () => mockState()
};
