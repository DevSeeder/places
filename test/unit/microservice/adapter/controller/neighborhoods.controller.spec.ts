import { Test, TestingModule } from '@nestjs/testing';
import { NeighborhoodsController } from '../../../../../src/microservice/adapter/controller/neighborhoods.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../../../src/config/configuration';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { NeighborhoodByCity } from '../../../../../src/microservice/domain/model/neighborhoods/neighborhood-by-city.model';
import { ExtensionsModule } from '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { GetNeighborhoodsByCityService } from '../../../../../src/microservice/domain/service/neighborhoods/get/get-neighborhoods-by-city.service';
import { SaveNeighborhoodsByCityService } from '../../../../../src/microservice/domain/service/neighborhoods/save-neighborhoods-by-city.service';

describe('NeighborhoodsController', () => {
  let neighborhoodsController: NeighborhoodsController;

  const mockGetNeighborhoodsService = {
    getNeighborhoodsByCity: () => {
      return;
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

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        }),
        ExtensionsModule
      ],
      controllers: [NeighborhoodsController],
      providers: [
        {
          provide: GetNeighborhoodsByCityService,
          useFactory: () => mockGetNeighborhoodsService
        },
        {
          provide: SaveNeighborhoodsByCityService,
          useFactory: () => mockSaveNeighborhoodsService
        }
      ]
    }).compile();

    neighborhoodsController = app.get<NeighborhoodsController>(
      NeighborhoodsController
    );
  });

  describe('NeighborhoodsController', () => {
    it('should call getNeighborhoodsByCity and return an array', async () => {
      const guiaMaisStub = sinon
        .stub(mockGetNeighborhoodsService, 'getNeighborhoodsByCity')
        .returns(mockNeighborhoods);

      const actual = await neighborhoodsController.getNeighborhoodsByCity(
        'brasil',
        'sc',
        'orleans'
      );

      expect(actual.body).to.be.an('array').that.contains;
      expect(actual.body).to.have.lengthOf(2);

      guiaMaisStub.restore();
    });
  });
});
