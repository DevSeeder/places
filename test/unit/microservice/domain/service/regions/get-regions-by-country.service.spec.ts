import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { Country } from '../../../../../../src/microservice/domain/schemas/country.schema';
import { GetRegionsByCountryService } from '../../../../../../src/microservice/domain/service/regions/get-regions-by-country.service';
import { StatesMongoose } from '../../../../../../src/microservice/adapter/repository/states/states-mongoose.repository';

describe('GetRegionsByCountryService', () => {
  let sut: GetRegionsByCountryService;

  const mockMongooseRepository = {
    findBySearchParams: () => {
      return [];
    },
    groupBy: () => {
      return [];
    }
  };

  const mockAggregatedRegions = [
    {
      _id: { region: 'South' },
      count: 3
    },
    {
      _id: { region: 'North' },
      count: 7
    }
  ];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: StatesMongoose,
          useValue: mockMongooseRepository
        },
        GetRegionsByCountryService
      ]
    }).compile();

    sut = app.get<GetRegionsByCountryService>(GetRegionsByCountryService);
  });

  describe('searchInDatabase', () => {
    it('should call searchInDatabase and return an array', async () => {
      const groupByStub = sinon
        .stub(mockMongooseRepository, 'groupBy')
        .returns(mockAggregatedRegions);

      const actual = await sut.searchInDatabase(new Country());

      expect(JSON.stringify(actual)).to.be.equal(
        JSON.stringify(['North', 'South'])
      );

      groupByStub.restore();
    });
  });
});
