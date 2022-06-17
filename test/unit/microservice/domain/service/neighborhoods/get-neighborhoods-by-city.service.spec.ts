import { Test, TestingModule } from '@nestjs/testing';
import { GetNeighborhoodsByCityService } from '../../../../../../src/microservice/domain/service/neighborhoods/get-neighborhoods-by-city.service';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { NeighborhoodsByCity } from '../../../../../../src/microservice/domain/model/neighborhoods-by-city.model';
import { SaveNeighborhoodsByCityService } from '../../../../../../src/microservice/domain/service/neighborhoods/save-neighborhoods-by-city.service';
import { NeighborhoodsMongoose } from '../../../../../../src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';

describe('GetNeighborhoodsByCityService', () => {
  let sut: GetNeighborhoodsByCityService;

  const mockGuiaMaisRepository = {
    getNeighborhoodsByCity: () => {
      return;
    }
  };

  const mockMongooseRepository = {
    findBySearchParams: () => {
      return [];
    }
  };

  const mockSaveNeighborhoodsService = {
    saveNeighborhoodsByCity: () => {
      return;
    },
    findNeighborhoodInDatabase: () => {
      return [];
    }
  };

  const mockNeighborhoods: NeighborhoodsByCity[] = [
    {
      name: 'Aires Rodrigues',
      city: 'Orleans-SC'
    },
    {
      name: 'Alto Paraná',
      city: 'Orleans-SC'
    }
  ];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: 'GuiaMaisRepository',
          useValue: mockGuiaMaisRepository
        },
        {
          provide: NeighborhoodsMongoose,
          useValue: mockMongooseRepository
        },
        {
          provide: SaveNeighborhoodsByCityService,
          useFactory: () => mockSaveNeighborhoodsService
        },
        GetNeighborhoodsByCityService
      ]
    }).compile();

    sut = app.get<GetNeighborhoodsByCityService>(GetNeighborhoodsByCityService);
  });

  describe('GetNeighborhoodsByCityService', () => {
    it('should call getNeighborhoodsByCity and return an array', async () => {
      const guiaMaisStub = sinon
        .stub(mockGuiaMaisRepository, 'getNeighborhoodsByCity')
        .returns(mockNeighborhoods);

      const actual = await sut.getNeighborhoodsByCity(
        'brasil',
        'sc',
        'orleans'
      );

      expect(actual).to.be.an('array');
      expect(actual.length).to.be.equal(2);

      guiaMaisStub.restore();
    });
  });
});
