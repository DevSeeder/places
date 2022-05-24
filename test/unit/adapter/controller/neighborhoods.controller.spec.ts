import { Test, TestingModule } from '@nestjs/testing';
import { NeighborhoodsController } from '../../../../src/adapter/controller/neighborhoods.controller';
import { NeighborhoodsService } from '../../../../src/adapter/service/neighborhoods.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../../src/config/configuration';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { NeighborhoodsByCity } from '../../../../src/domain/model/neighborhoods-by-city.model';

describe('NeighborhoodsController', () => {
  let neighborhoodsController: NeighborhoodsController;

  const mockGuiaMaisRepository = {
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
        })
      ],
      controllers: [NeighborhoodsController],
      providers: [
        {
          provide: 'GuiaMaisRepository',
          useValue: mockGuiaMaisRepository
        },
        NeighborhoodsService
      ]
    }).compile();

    neighborhoodsController = app.get<NeighborhoodsController>(
      NeighborhoodsController
    );
  });

  describe('NeighborhoodsController', () => {
    it('should call getNeighborhoodsByCity and return an array', async () => {
      const guiaMaisStub = sinon
        .stub(mockGuiaMaisRepository, 'getNeighborhoodsByCity')
        .returns(mockNeighborhoods);

      const actual = await neighborhoodsController.getNeighborhoodsByCity(
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
