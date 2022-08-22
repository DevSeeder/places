import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { Country } from '../../../../../../../src/microservice/domain/schemas/country.schema';
import { City } from '../../../../../../../src/microservice/domain/schemas/city.schema';
import { State } from '../../../../../../../src/microservice/domain/schemas/state.schema';
import { Translations } from '../../../../../../../src/microservice/domain/model/translations.model';
import { EnumTranslations } from '../../../../../../../src/microservice/domain/enumerators/enum-translations.enumerator';
import { ValidateCountryByNameOrAliasService } from '../../../../../../../src/microservice/domain/service/countries/validate-country-by-name-or-alias.service';
import { mockValidateCountryService } from '../../../../../../mock/services/validate/validate-service.mock';
import { GetStatesByCountryService } from '../../../../../../../src/microservice/domain/service/states/get-states-by-country.service';
import { SeedNeighborhoodsByCountryService } from '../../../../../../../src/microservice/domain/service/seed/neighborhoods/seed-neighborhoods-by-country.service';
import { mockgetStatesByCountryService } from '../../../../../../mock/services/states/states-service.mock';
import { mockGetNeighborhoodsByCountryService } from '../../../../../../mock/services/neighborhoods/get-neighborhoods-service.mock';
import { GetNeighborhoodsByCountryService } from '../../../../../../../src/microservice/domain/service/neighborhoods/get/get-neighborhoods-by-country.service';
import { PublishSeedNeighborhoodsByStateService } from '../../../../../../../src/microservice/domain/service/seed/neighborhoods/publish/publish-seed-neighborhoods-by-state.service';
import { mockPublishService } from '../../../../../../mock/services/seed/publish/publish-seed-service.mock';

describe('SeedNeighborhoodsByCountryService', () => {
  let sut: SeedNeighborhoodsByCountryService;

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

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: ValidateCountryByNameOrAliasService,
          useFactory: () => mockValidateCountryService
        },
        {
          provide: GetStatesByCountryService,
          useValue: mockgetStatesByCountryService
        },
        {
          provide: GetNeighborhoodsByCountryService,
          useValue: mockGetNeighborhoodsByCountryService
        },
        {
          provide: PublishSeedNeighborhoodsByStateService,
          useValue: mockPublishService
        },
        SeedNeighborhoodsByCountryService
      ]
    }).compile();

    sut = app.get<SeedNeighborhoodsByCountryService>(
      SeedNeighborhoodsByCountryService
    );
  });

  describe('seedNeighborhoodsByCountry', () => {
    it('should call seedNeighborhoodsByCountry and return "Seed Requested!"', async () => {
      const groupByCityStub = sinon
        .stub(mockValidateCountryService, 'validateCountry')
        .returns(country);

      const validateStub = sinon
        .stub(mockgetStatesByCountryService, 'findStatesByCountry')
        .returns([state]);

      const actual = await sut.seedNeighborhoodsByCountry('brasil');

      expect(actual.success).to.be.equal(true);
      expect(actual.response).to.be.equal('Seed Requested!');

      groupByCityStub.restore();
      validateStub.restore();
    });

    it('should call SeedNeighborhoodsByCountryService and return "Nothing to seed"', async () => {
      const groupByCityStub = sinon
        .stub(mockValidateCountryService, 'validateCountry')
        .returns(country);

      const validateStub = sinon
        .stub(mockgetStatesByCountryService, 'findStatesByCountry')
        .returns([]);

      const actual = await sut.seedNeighborhoodsByCountry('brasil');

      expect(actual.success).to.be.equal(true);
      expect(actual.response).to.be.equal('Nothing to seed');

      groupByCityStub.restore();
      validateStub.restore();
    });
  });
});
