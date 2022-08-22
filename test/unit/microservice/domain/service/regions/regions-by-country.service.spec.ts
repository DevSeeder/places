import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { Country } from '../../../../../../src/microservice/domain/schemas/country.schema';
import { GetRegionsByCountryService } from '../../../../../../src/microservice/domain/service/regions/get-regions-by-country.service';
import { ValidateCountryByNameOrAliasService } from '../../../../../../src/microservice/domain/service/countries/validate-country-by-name-or-alias.service';
import { mockValidateCountryService } from '../../../../../mock/services/validate/validate-service.mock';
import {
  mockAggregatedRegions,
  mockGetRegionsByCountryService
} from '../../../../../mock/services/regions/regions-service.mock';
import { SeedRegionsByCountryService } from '../../../../../../src/microservice/domain/service/seed/regions/seed-regions-by-country.service';
import { RegionsByCountryService } from '../../../../../../src/microservice/domain/service/regions/regions-by-country.service';
import { SearchRegionsDTO } from '../../../../../../src/microservice/domain/model/search/regions/search-regions-dto.model';

describe('RegionsByCountryService', () => {
  let sut: RegionsByCountryService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: ValidateCountryByNameOrAliasService,
          useValue: mockValidateCountryService
        },
        {
          provide: GetRegionsByCountryService,
          useValue: mockGetRegionsByCountryService
        },
        {
          provide: SeedRegionsByCountryService,
          useValue: mockValidateCountryService
        },
        RegionsByCountryService
      ]
    }).compile();

    sut = app.get<RegionsByCountryService>(RegionsByCountryService);
  });

  describe('validateAndConvertInput', () => {
    it('should call validateAndConvertInput and return a Country', async () => {
      const mockCountry = new Country();

      const mockSearch = new SearchRegionsDTO('any');
      const validateStub = sinon
        .stub(mockValidateCountryService, 'validateCountry')
        .returns(mockCountry);

      const actual = await sut.validateAndConvertInput(mockSearch);

      expect(JSON.stringify(actual)).to.be.equal(JSON.stringify(mockCountry));

      validateStub.restore();
    });
  });

  describe('getFindAndSeedElements', () => {
    it('should call getFindAndSeedElements and return a Country', async () => {
      const mockCountry = new Country();

      const mockSearch = new SearchRegionsDTO('any');
      const validateStub = sinon
        .stub(mockValidateCountryService, 'validateCountry')
        .returns(mockCountry);

      const getRegionsStub = sinon
        .stub(mockGetRegionsByCountryService, 'searchInDatabase')
        .returns(mockAggregatedRegions);

      const actual = await sut.getFindAndSeedElements(mockSearch);

      expect(JSON.stringify(actual)).to.be.equal(
        JSON.stringify(mockAggregatedRegions)
      );

      validateStub.restore();
      getRegionsStub.restore();
    });
  });
});
