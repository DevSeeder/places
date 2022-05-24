import { Test, TestingModule } from '@nestjs/testing';
import { NeighborhoodsService } from '../../../src/adapter/service/neighborhoods.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../src/config/configuration';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { NeighborhoodsByCity } from '../../../src/domain/model/neighborhoods-by-city.model';

describe('NeighborhoodsService', () => {
  let sut: NeighborhoodsService;

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
      controllers: [],
      providers: [
        {
          provide: 'GuiaMaisRepository',
          useValue: mockGuiaMaisRepository
        },
        NeighborhoodsService
      ]
    }).compile();

    sut = app.get<NeighborhoodsService>(NeighborhoodsService);
    // C:\Users\Maick\Documents\dev-projects\nest_js\places\test\mock\html\repository\neighborhoods\guia-mais_neighborhoods_orleans.html
  });

  describe('NeighborhoodsService', () => {
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
