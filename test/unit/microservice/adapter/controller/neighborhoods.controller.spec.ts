import { Test, TestingModule } from '@nestjs/testing';
import { NeighborhoodsController } from '../../../../../src/microservice/adapter/controller/neighborhoods.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../../../src/config/configuration';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { NeighborhoodsByCity } from '../../../../../src/microservice/domain/model/neighborhoods-by-city.model';
import { ExtensionsModule } from '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { NeighborhoodsService } from '../../../../../src/microservice/domain/service/neighborhoods.service';

describe('NeighborhoodsController', () => {
  let neighborhoodsController: NeighborhoodsController;

  const mockNeighborhoodsService = {
    getNeighborhoodsByCity: () => {
      return;
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
          provide: NeighborhoodsService,
          useFactory: () => mockNeighborhoodsService
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
        .stub(mockNeighborhoodsService, 'getNeighborhoodsByCity')
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
