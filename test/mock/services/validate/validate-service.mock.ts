import { Country } from '../../../../src/microservice/domain/schemas/country.schema';

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
