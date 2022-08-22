import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { SearchNeighborhoodsDTO } from '../../../../../../../src/microservice/domain/model/search/neighborhoods/search-neighborhoods-dto.model';
import { Country } from '../../../../../../../src/microservice/domain/schemas/country.schema';
import { SeedRegionsByCountryService } from '../../../../../../../src/microservice/domain/service/seed/regions/seed-regions-by-country.service';
import { ValidateCountryByNameOrAliasService } from '../../../../../../../src/microservice/domain/service/countries/validate-country-by-name-or-alias.service';
import { mockValidateCountryService } from '../../../../../../../test/mock/services/validate/validate-service.mock';
import { UpdateStatesByRegionService } from '../../../../../../../src/microservice/domain/service/states/update-states-by-region.service';
import { mockPuppeteerRepository } from '../../../../../../../test/mock/repositories/puppeteer-repository.mock';
import { mockUpdateStateService } from '../../../../../../../test/mock/services/states/states-service.mock';
import { RegionsByCountry } from '../../../../../../../src/microservice/domain/model/regions/regions-by-country.model';

describe('SeedRegionsByCountryService', () => {
  let sut: SeedRegionsByCountryService;

  const mockRegionsByCountry = (): RegionsByCountry[] => {
    const rbc = new RegionsByCountry();
    rbc.name = 'South';
    rbc.states = ['RS', 'SC', 'PR'];
    return [rbc];
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: 'CityPopulationRepository',
          useValue: mockPuppeteerRepository
        },
        {
          provide: ValidateCountryByNameOrAliasService,
          useFactory: () => mockValidateCountryService
        },
        {
          provide: UpdateStatesByRegionService,
          useValue: mockUpdateStateService
        },
        SeedRegionsByCountryService
      ]
    }).compile();

    sut = app.get<SeedRegionsByCountryService>(SeedRegionsByCountryService);
  });

  describe('seedRegionsByCountry', () => {
    it('should call seedRegionsByCountry and return "Seeded"', async () => {
      const groupByCityStub = sinon
        .stub(mockValidateCountryService, 'validateCountry')
        .returns(new Country());

      const puppeteerStub = sinon
        .stub(mockPuppeteerRepository, 'getElements')
        .returns(mockRegionsByCountry());

      const updateStub = sinon.stub(
        mockUpdateStateService,
        'updateStatesByRegion'
      );

      const searchParams = new SearchNeighborhoodsDTO('brasil', 'sc');

      const actual = await sut.seedRegionsByCountry(searchParams);

      expect(JSON.stringify(actual)).to.be.equal(
        JSON.stringify(mockRegionsByCountry())
      );

      groupByCityStub.restore();
      puppeteerStub.restore();
      updateStub.restore();
    });
  });
});
