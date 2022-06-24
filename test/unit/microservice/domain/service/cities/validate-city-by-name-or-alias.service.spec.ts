import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { CitiesMongoose } from '../../../../../../src/microservice/adapter/repository/cities/cities-mongoose.repository';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { ValidateCityByNameOrAliasService } from '../../../../../../src/microservice/domain/service/cities/validate-city-by-name-or-alias.service';
import { City } from '../../../../../../src/microservice/domain/schemas/city.schema';

describe('ValidateCityByNameOrAliasService', () => {
  let sut: ValidateCityByNameOrAliasService;

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
        ValidateCityByNameOrAliasService
      ]
    }).compile();

    sut = app.get<ValidateCityByNameOrAliasService>(
      ValidateCityByNameOrAliasService
    );
  });

  describe('getCityByNameOrAlias', () => {
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

  describe('validateCity', () => {
    it('should call validateCity and throws invalid data exception', async () => {
      const getCityStub = sinon
        .stub(mockCitiesMongooseRepository, 'findByNameOrAlias')
        .returns([]);

      try {
        await sut.validateCity('orleans', 1, 2);
      } catch (err) {
        expect(err.message).to.be.equal(`Invalid City 'orleans'`);
      }

      getCityStub.restore();
    });
  });
});
