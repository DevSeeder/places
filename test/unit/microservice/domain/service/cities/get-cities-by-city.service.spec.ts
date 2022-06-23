import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { CitiesMongoose } from '../../../../../../src/microservice/adapter/repository/Cities/Cities-mongoose.repository';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { GetCityByNameOrAliasService } from '../../../../../../src/microservice/domain/service/Cities/get-City-by-name-or-alias.service';
import { City } from '../../../../../../src/microservice/domain/schemas/City.schema';

describe('GetCityByNameOrAliasService', () => {
  let sut: GetCityByNameOrAliasService;

  const mockCitiesMongooseRepository = {
    findByNameOrAlias: () => {
      return [new City()];
    }
  };

  const mockMongoCities = () => {
    const arr = [];
    const item1 = new City();
    arr.push(item1);
    return arr;
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: CitiesMongoose,
          useValue: mockCitiesMongooseRepository
        },
        GetCityByNameOrAliasService
      ]
    }).compile();

    sut = app.get<GetCityByNameOrAliasService>(GetCityByNameOrAliasService);
  });

  describe('GetCityByNameOrAliasService', () => {
    it('should call getCityByCity and return an array by mongodb', async () => {
      const mongoFindStub = sinon
        .stub(mockCitiesMongooseRepository, 'findByNameOrAlias')
        .returns(mockMongoCities());

      const actual = await sut.getCityByNameOrAlias('orleans', 1, 2);

      expect(JSON.stringify(actual)).to.be.equal(
        JSON.stringify(mockMongoCities())
      );

      mongoFindStub.restore();
    });
  });
});
