import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { NeighborhoodByCity } from '../../../../../../../src/microservice/domain/model/neighborhoods/neighborhood-by-city.model';
import { NeighborhoodsMongoose } from '../../../../../../../src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { ValidateInputParamsService } from '../../../../../../../src/microservice/domain/service/validate/validate-input-params.service';
import { GetNeighborhoodsByCountryService } from '../../../../../../../src/microservice/domain/service/neighborhoods/get/get-neighborhoods-by-country.service';

describe('GetNeighborhoodsByCountryService', () => {
  let sut: GetNeighborhoodsByCountryService;

  const mockNeighborhoodsMongooseRepository = {
    groupBy: () => {
      return [];
    }
  };

  const mockValidateService = {
    validateAndConvertSearchByState: () => {
      return {};
    },
    validateAndConvertSearchByCity: () => {
      return {};
    }
  };

  const mockNeighborhoods: NeighborhoodByCity[] = [
    {
      name: 'Aires Rodrigues',
      city: 'Orleans - SC',
      countryId: 31,
      stateId: 2014,
      cityId: 1
    },
    {
      name: 'Alto Paraná',
      city: 'Orleans - SC',
      countryId: 31,
      stateId: 2014,
      cityId: 2
    }
  ];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: NeighborhoodsMongoose,
          useValue: mockNeighborhoodsMongooseRepository
        },
        {
          provide: ValidateInputParamsService,
          useFactory: () => mockValidateService
        },
        GetNeighborhoodsByCountryService
      ]
    }).compile();

    sut = app.get<GetNeighborhoodsByCountryService>(
      GetNeighborhoodsByCountryService
    );
  });

  describe('groupByCountry', () => {
    it('should call groupByCountry and return an array', async () => {
      const mongoFindStub = sinon
        .stub(mockNeighborhoodsMongooseRepository, 'groupBy')
        .returns(mockNeighborhoods);

      const actual = await sut.groupByCountry(1);

      expect(JSON.stringify(actual)).to.be.equal(
        JSON.stringify(mockNeighborhoods)
      );

      mongoFindStub.restore();
    });
  });
});
