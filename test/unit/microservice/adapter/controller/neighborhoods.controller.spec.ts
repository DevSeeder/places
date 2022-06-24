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
import { SearchNeighborhoodsInput } from '../../../../../src/microservice/domain/model/search/search-neighborhoods-input.model';
import { GetNeighborhoodsByStateService } from '../../../../../src/microservice/domain/service/neighborhoods/get/get-neighborhoods-by-state.service';
import { SeedNeighborhoodsByStateService } from '../../../../../src/microservice/domain/service/neighborhoods/seed/seed-neighborhoods-by-state.service';
import { ValidateInputParamsService } from '../../../../../src/microservice/domain/service/validate-input-params.service';

describe('NeighborhoodsController', () => {
  let neighborhoodsController: NeighborhoodsController;

  const mockGetNeighborhoodsService = {
    getNeighborhoodsByCity: () => {
      return;
    }
  };

  const mockGetNeighborhoodsByStateService = {
    getNeighborhoodsByState: () => {
      return;
    }
  };

  const mockSeedNeighborhoodsByStateService = {
    seedNeighborhoodsByState: () => {
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
        },
        {
          provide: GetNeighborhoodsByStateService,
          useFactory: () => mockGetNeighborhoodsByStateService
        },
        {
          provide: SeedNeighborhoodsByStateService,
          useFactory: () => mockSeedNeighborhoodsByStateService
        },
        {
          provide: ValidateInputParamsService,
          useFactory: () => mockValidateService
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

      const searchParams = new SearchNeighborhoodsInput(
        'brasil',
        'sc',
        'orleans'
      );

      const actual = await neighborhoodsController.getNeighborhoodsByCity(
        searchParams
      );

      expect(actual.body).to.be.an('array').that.contains;
      expect(actual.body).to.have.lengthOf(2);

      guiaMaisStub.restore();
    });
  });
});
