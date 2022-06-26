import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { SaveNeighborhoodsByCityService } from '../../../../../../src/microservice/domain/service/neighborhoods/save-neighborhoods-by-city.service';
import { NeighborhoodsMongoose } from '../../../../../../src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { ExtensionsModule } from '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { SearchNeighborhoodsInput } from '../../../../../../src/microservice/domain/model/search/search-neighborhoods-input.model';
import { NeighborhoodByCity } from '../../../../../../src/microservice/domain/model/neighborhoods/neighborhood-by-city.model';
import { Neighborhood } from '../../../../../../src/microservice/domain/schemas/neighborhood.schema';
import { Country } from '../../../../../../src/microservice/domain/schemas/country.schema';
import { State } from '../../../../../../src/microservice/domain/schemas/state.schema';
import { City } from '../../../../../../src/microservice/domain/schemas/city.schema';
import { SearchNeighborhoodsDB } from '../../../../../../src/microservice/domain/model/search/neighborhoods/search-neighborhoods-db.model';

describe('SaveNeighborhoodsByCityService', () => {
  let sut: SaveNeighborhoodsByCityService;

  const mockNeighborhoods: NeighborhoodByCity[] = [
    {
      name: 'Aires Rodrigues',
      city: 'Orleans-SC'
    },
    {
      name: 'Alto Paraná',
      city: 'Orleans-SC'
    }
  ];

  const mockNeighborhoodMongooseRepository = {
    findBySearchParams: () => {
      return [];
    },
    insertOne: () => {
      return;
    },
    startTransaction: () => {
      return;
    },
    commit: () => {
      return;
    },
    rollback: () => {
      return;
    }
  };

  const mockMongoNeighborhoods = () => {
    const arr = [];
    const item1 = new Neighborhood();
    arr.push(item1);
    return arr;
  };

  const mockConvertedSearch = () => {
    const mockCountry = new Country();
    mockCountry.name = 'Brazil';
    mockCountry.id = 1;
    const mockState = new State();
    mockState.name = 'Santa Catarina';
    mockState.id = 2;
    mockState.stateCode = 'SC';
    const mockCity = new City();
    mockCity.name = 'Orleans';
    mockCity.id = 3;
    return {
      country: mockCountry,
      state: mockState,
      city: mockCity
    };
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ExtensionsModule],
      controllers: [],
      providers: [
        {
          provide: NeighborhoodsMongoose,
          useValue: mockNeighborhoodMongooseRepository
        },
        SaveNeighborhoodsByCityService
      ]
    }).compile();

    sut = app.get<SaveNeighborhoodsByCityService>(
      SaveNeighborhoodsByCityService
    );
  });

  describe('saveNeighborhoodsByCity', () => {
    it('should call saveNeighborhoodsByCity and call insert twice', async () => {
      const findStub = sinon
        .stub(sut, 'findNeighborhoodInDatabase')
        .returns([]);

      const insertSpy = sinon.spy(
        mockNeighborhoodMongooseRepository,
        'insertOne'
      );

      const searchParams = new SearchNeighborhoodsInput(
        'brasil',
        'sc',
        'orleans'
      );

      await sut.saveNeighborhoodsByCity(
        mockNeighborhoods,
        searchParams,
        mockConvertedSearch()
      );

      sinon.assert.calledTwice(insertSpy);

      findStub.restore();
      insertSpy.restore();
    });

    it('should call saveNeighborhoodsByCity and not call insert', async () => {
      const findStub = sinon
        .stub(sut, 'findNeighborhoodInDatabase')
        .returns(mockMongoNeighborhoods());

      const insertSpy = sinon.spy(
        mockNeighborhoodMongooseRepository,
        'insertOne'
      );

      const searchParams = new SearchNeighborhoodsInput(
        'brasil',
        'sc',
        'orleans'
      );

      await sut.saveNeighborhoodsByCity(
        mockNeighborhoods,
        searchParams,
        mockConvertedSearch()
      );

      sinon.assert.notCalled(insertSpy);

      findStub.restore();
      insertSpy.restore();
    });
  });

  describe('findNeighborhoodInDatabase', () => {
    it('should call saveNeighborhoodsByCity and call insert twice', async () => {
      const findInDatabaseStub = sinon.stub(sut, 'findInDatabase').returns();

      const searchParams = new SearchNeighborhoodsDB(1, 2, 3);

      await sut.findNeighborhoodInDatabase(
        mockConvertedSearch(),
        'Alto Paraná'
      );

      searchParams.name = 'Alto Paraná';

      sinon.assert.calledOnceWithExactly(findInDatabaseStub, searchParams);

      findInDatabaseStub.restore();
    });
  });
});
