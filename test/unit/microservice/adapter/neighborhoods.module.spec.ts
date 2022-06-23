import { HttpStatus } from '@nestjs/common';
import { NeighborhoodsModule } from '../../../../src/microservice/adapter/neighborhoods.module';
import { Test, TestingModule } from '@nestjs/testing';
import { NeighborhoodsController } from '../../../../src/microservice/adapter/controller/neighborhoods.controller';
import { ExtensionsModule } from '../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { NeighborhoodsMongoose } from '../../../../src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Neighborhood } from '../../../../src/microservice/domain/schemas/neighborhood.schema';
import { mockModelMongoose } from '../../../mock/mongoose/mock-mongoose';
import { Country } from '../../../../src/microservice/domain/schemas/country.schema';
import { CountriesMongoose } from '../../../../src/microservice/adapter/repository/countries/countries-mongoose.repository';
import { State } from '../../../../src/microservice/domain/schemas/state.schema';
import { City } from '../../../../src/microservice/domain/schemas/city.schema';
import { StatesMongoose } from '../../../../src/microservice/adapter/repository/states/states-mongoose.repository';
import { CitiesMongoose } from '../../../../src/microservice/adapter/repository/cities/cities-mongoose.repository';

describe('NeighborhoodsModule', () => {
  let sut: NeighborhoodsController;
  let app: TestingModule;

  const mockGuiaMaisRepository = {
    getNeighborhoodsByCity() {
      return;
    }
  };

  const mockNeighborhoodsMongooseRepository = {
    findBySearchParams: () => {
      return [];
    },
    insert: () => {
      return;
    }
  };

  const mockPlacesMongooseRepository = {
    findByNameOrAlias: () => {
      return [];
    }
  };

  beforeEach(async function () {
    app = await Test.createTestingModule({
      imports: [NeighborhoodsModule, ExtensionsModule],
      providers: []
    })
      .overrideProvider('GuiaMaisRepository')
      .useValue(mockGuiaMaisRepository)
      .overrideProvider(NeighborhoodsMongoose)
      .useValue(mockNeighborhoodsMongooseRepository)
      .overrideProvider(CountriesMongoose)
      .useValue(mockPlacesMongooseRepository)
      .overrideProvider(StatesMongoose)
      .useValue(mockPlacesMongooseRepository)
      .overrideProvider(CitiesMongoose)
      .useValue(mockPlacesMongooseRepository)
      .overrideProvider(getModelToken(Neighborhood.name))
      .useValue(mockModelMongoose)
      .overrideProvider(getModelToken(Country.name))
      .useValue(mockModelMongoose)
      .overrideProvider(getModelToken(State.name))
      .useValue(mockModelMongoose)
      .overrideProvider(getModelToken(City.name))
      .useValue(mockModelMongoose)
      .compile();

    sut = app.get<NeighborhoodsController>(NeighborhoodsController);
  });

  describe('res', function () {
    it('should call buildResponse for status 200', async function () {
      const actual = await sut.buildResponse(HttpStatus.OK, {});
      expect(actual.status).toBe(HttpStatus.OK);
    });
  });
});
