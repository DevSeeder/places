import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../../../src/config/configuration';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ExtensionsModule } from '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { CountriesController } from '../../../../../src/microservice/adapter/controller/countries.controller';
import { GetCountriesService } from '../../../../../src/microservice/domain/service/countries/get-countries.service';
import { Country } from '../../../../../src/microservice/domain/schemas/country.schema';

describe('CountriesController', () => {
  let countriesController: CountriesController;

  const mockGetCountriesService = {
    getAll: () => {
      return;
    }
  };

  const mockCountries = () => {
    const country1 = new Country();
    country1.name = 'any';

    const country2 = new Country();
    country2.name = 'any';
    return [country1, country2];
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        }),
        ExtensionsModule
      ],
      controllers: [CountriesController],
      providers: [
        {
          provide: GetCountriesService,
          useFactory: () => mockGetCountriesService
        }
      ]
    }).compile();

    countriesController = app.get<CountriesController>(CountriesController);
  });

  describe('getAllCountries', () => {
    it('should call getAllCountries and return an array', async () => {
      const getServiceStub = sinon
        .stub(mockGetCountriesService, 'getAll')
        .returns(mockCountries());

      const actual = await countriesController.getAllCountries();

      expect(actual.body).to.be.an('array').that.contains;
      expect(actual.body).to.have.lengthOf(2);

      getServiceStub.restore();
    });
  });
});
