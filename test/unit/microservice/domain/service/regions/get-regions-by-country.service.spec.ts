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
    },
    aggregate: () => {
      return [];
    }
  };

  const mockAggregatedRegions = [
    {
      _id: 'South',
      count: 3,
      States: ['RS', 'SC', 'PR']
    },
    {
      _id: 'North',
      count: 7,
      States: ['any_state1', 'any_state2']
    }
  ];

  const mockResponse = [
    {
      name: 'South',
      states: ['RS', 'SC', 'PR']
    },
    {
      name: 'North',
      states: ['any_state1', 'any_state2']
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
        .stub(mockMongooseRepository, 'aggregate')
        .returns(mockAggregatedRegions);

      const actual = await sut.searchInDatabase(new Country());

      expect(JSON.stringify(actual)).to.be.equal(JSON.stringify(mockResponse));

      groupByStub.restore();
    });
  });
});
