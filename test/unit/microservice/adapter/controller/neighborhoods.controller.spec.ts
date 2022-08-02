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
import { SearchNeighborhoodsDTO } from '../../../../../src/microservice/domain/model/search/neighborhoods/search-neighborhoods-dto.model';
import { GetNeighborhoodsByStateService } from '../../../../../src/microservice/domain/service/neighborhoods/get/get-neighborhoods-by-state.service';
import { SeedNeighborhoodsByStateService } from '../../../../../src/microservice/domain/service/seed/neighborhoods/seed-neighborhoods-by-state.service';
import { ValidateInputParamsService } from '../../../../../src/microservice/domain/service/validate/validate-input-params.service';

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
      city: 'Orleans - SC',
      countryId: 31,
      stateId: 2014,
      cityId: 1
    },
    {
      name: 'Alto Paraná',
      city: 'Orleans - SC',
      countryId: 31,
      stateId: 2014,
      cityId: 2
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

  describe('getNeighborhoodsByCity', () => {
    it('should call getNeighborhoodsByCity and return an array', async () => {
      const getServiceStub = sinon
        .stub(mockGetNeighborhoodsService, 'getNeighborhoodsByCity')
        .returns(mockNeighborhoods);

      const searchParams = new SearchNeighborhoodsDTO(
        'brasil',
        'sc',
        'orleans'
      );

      const actual = await neighborhoodsController.getNeighborhoodsByCity(
        searchParams
      );

      expect(actual.body).to.be.an('array').that.contains;
      expect(actual.body).to.have.lengthOf(2);

      getServiceStub.restore();
    });
  });

  describe('getNeighborhoodsByState', () => {
    it('should call getNeighborhoodsByState and return an array', async () => {
      const getServiceStub = sinon
        .stub(mockGetNeighborhoodsByStateService, 'getNeighborhoodsByState')
        .returns(mockNeighborhoods);

      const searchParams = new SearchNeighborhoodsDTO('brasil', 'sc');

      const actual = await neighborhoodsController.getNeighborhoodsByState(
        searchParams
      );

      expect(actual.body).to.be.an('array').that.contains;
      expect(actual.body).to.have.lengthOf(2);

      getServiceStub.restore();
    });
  });

  // describe('seedNeighborhoodsByState', () => {
  //   it('should call seedNeighborhoodsByState and return a response', async () => {
  //     const mockResponseSeed = {
  //       success: true,
  //       response: 'Seeded'
  //     };

  //     const seedServiceStub = sinon
  //       .stub(mockSeedNeighborhoodsByStateService, 'seedNeighborhoodsByState')
  //       .returns(mockResponseSeed);

  //     const searchParams = new SearchNeighborhoodsDTO('brasil', 'sc');

  //     const actual = await neighborhoodsController.seedNeighborhoodsByState(
  //       searchParams
  //     );

  //     expect(actual.body.success).to.be.equal(true);
  //     expect(actual.body.response).to.be.equal('Seeded');

  //     seedServiceStub.restore();
  //   });
  // });
});
