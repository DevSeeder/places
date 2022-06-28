import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { CountriesMongoose } from '../../../../../../src/microservice/adapter/repository/countries/countries-mongoose.repository';
import { GetCountriesService } from '../../../../../../src/microservice/domain/service/countries/get-countries.service';
import { CountryResponse } from '../../../../../../src/microservice/domain/model/countries/country-response.model';

describe('GetCountriesService', () => {
  let sut: GetCountriesService;

  const mockMongoose = {
    findAll: () => {
      return [];
    }
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: CountriesMongoose,
          useValue: mockMongoose
        },
        GetCountriesService
      ]
    }).compile();

    sut = app.get<GetCountriesService>(GetCountriesService);
  });

  const mockCountries = () => {
    const country1 = new CountryResponse();
    country1.id = 1;
    country1.name = 'any';

    const country2 = new CountryResponse();
    country1.id = 2;
    country1.name = 'any';

    return [country1, country2];
  };

  describe('getAll', () => {
    it('should call getAll and return an array', async () => {
      const arr = mockCountries();
      const getCitiesStub = sinon.stub(mockMongoose, 'findAll').returns(arr);

      const actual = await sut.getAll();

      expect(actual).to.be.equal(arr);

      getCitiesStub.restore();
    });
  });
});
