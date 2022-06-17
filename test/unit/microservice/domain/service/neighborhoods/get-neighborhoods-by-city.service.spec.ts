import { Test, TestingModule } from '@nestjs/testing';
import { GetNeighborhoodsByCityService } from '../../../../../../src/microservice/domain/service/neighborhoods/get-neighborhoods-by-city.service';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { NeighborhoodsByCity } from '../../../../../../src/microservice/domain/model/neighborhoods-by-city.model';
import { SaveNeighborhoodsByCityService } from '../../../../../../src/microservice/domain/service/neighborhoods/save-neighborhoods-by-city.service';
import { NeighborhoodsMongoose } from '../../../../../../src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { Neighborhood } from '../../../../../../src/microservice/domain/schemas/neighborhood.schema';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';

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

  const mockMongoNeighborhoods = () => {
    const arr = [];
    const item1 = new Neighborhood();
    arr.push(item1);
    return arr;
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
    it('should call getNeighborhoodsByCity and return an array by puppeteer', async () => {
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

    it('should call getNeighborhoodsByCity and return an array by mongodb', async () => {
      const mongoFindStub = sinon
        .stub(sut, 'findInDatabase')
        .returns(mockMongoNeighborhoods());

      const actual = await sut.getNeighborhoodsByCity(
        'brasil',
        'sc',
        'orleans'
      );

      expect(JSON.stringify(actual)).to.be.equal(
        JSON.stringify(mockMongoNeighborhoods())
      );

      mongoFindStub.restore();
    });
  });
});
