import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { CountriesMongoose } from '../../../../../../src/microservice/adapter/repository/countries/countries-mongoose.repository';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { GetCountryByNameOrAliasService } from '../../../../../../src/microservice/domain/service/countries/get-country-by-name-or-alias.service';
import { Country } from '../../../../../../src/microservice/domain/schemas/country.schema';

describe('GetCountryByNameOrAliasService', () => {
  let sut: GetCountryByNameOrAliasService;

  const mockCountriesMongooseRepository = {
    findByNameOrAlias: () => {
      return [new Country()];
    }
  };

  const mockMongoCountries = () => {
    const arr = [];
    const item1 = new Country();
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
        GetCountryByNameOrAliasService
      ]
    }).compile();

    sut = app.get<GetCountryByNameOrAliasService>(
      GetCountryByNameOrAliasService
    );
  });

  describe('GetCountryByNameOrAliasService', () => {
    it('should call getCountryByCity and return an array by mongodb', async () => {
      const mongoFindStub = sinon
        .stub(mockCountriesMongooseRepository, 'findByNameOrAlias')
        .returns(mockMongoCountries());

      const actual = await sut.getCountryByNameOrAlias('brasil');

      expect(JSON.stringify(actual)).to.be.equal(
        JSON.stringify(mockMongoCountries())
      );

      mongoFindStub.restore();
    });
  });
});
