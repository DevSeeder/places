import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { CountriesMongoose } from '../../../../../../src/microservice/adapter/repository/countries/countries-mongoose.repository';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { ValidateCountryByNameOrAliasService } from '../../../../../../src/microservice/domain/service/countries/validate-country-by-name-or-alias.service';
import { Country } from '../../../../../../src/microservice/domain/schemas/country.schema';

describe('ValidateCountryByNameOrAliasService', () => {
  let sut: ValidateCountryByNameOrAliasService;

  const mockCountriesMongooseRepository = {
    findByNameOrAliasOrId: () => {
      return [new Country()];
    }
  };

  const mockMongoCountries = () => {
    const arr = [];
    const item1 = new Country();
    arr.push(item1);
    return arr;
  };

  const mockMongoCountriesNotImpl = () => {
    const arr = [];
    const item1 = new Country();
    item1.id = 1;
    arr.push(item1);
    return arr;
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: CountriesMongoose,
          useValue: mockCountriesMongooseRepository
        },
        ValidateCountryByNameOrAliasService
      ]
    }).compile();

    sut = app.get<ValidateCountryByNameOrAliasService>(
      ValidateCountryByNameOrAliasService
    );
  });

  describe('validateCountry', () => {
    it('should call validateCountry and throws invalid data exception', async () => {
      const getCountryStub = sinon
        .stub(mockCountriesMongooseRepository, 'findByNameOrAliasOrId')
        .returns([]);

      try {
        await sut.validateCountry('brasil');
      } catch (err) {
        expect(err.message).to.be.equal(`Invalid Country 'brasil'`);
      }

      getCountryStub.restore();
    });

    it('should call validateCountry and throws Country not supported!', async () => {
      const getCountryStub = sinon
        .stub(mockCountriesMongooseRepository, 'findByNameOrAliasOrId')
        .returns(mockMongoCountriesNotImpl());

      try {
        await sut.validateCountry('brasil', true);
      } catch (err) {
        expect(err.message).to.be.equal(`Country not supported!`);
      }

      getCountryStub.restore();
    });
  });

  describe('getCountryByCity', () => {
    it('should call getCountryByCity and return an array by mongodb', async () => {
      const mongoFindStub = sinon
        .stub(mockCountriesMongooseRepository, 'findByNameOrAliasOrId')
        .returns(mockMongoCountries());

      const actual = await sut.getCountryByNameOrAlias('brasil');

      expect(JSON.stringify(actual)).to.be.equal(
        JSON.stringify(mockMongoCountries())
      );

      mongoFindStub.restore();
    });

    it('should call validateCountry and return a object', async () => {
      const country = new Country();
      country.name = 'any';

      const getCountryStub = sinon
        .stub(mockCountriesMongooseRepository, 'findByNameOrAliasOrId')
        .returns([country]);

      const actual = await sut.validateCountry('orleans');

      expect(actual).to.be.equal(country);

      getCountryStub.restore();
    });
  });
});
