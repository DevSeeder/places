import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../../../src/config/configuration';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ExtensionsModule } from '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { RegionsController } from '../../../../../src/microservice/adapter/controller/regions.controller';
import { RegionsByCountryService } from '../../../../../src/microservice/domain/service/regions/regions-by-country.service';
import { mockFinderSeederService } from '../../../../mock/services/seed/finder-seed-service.mock';
import { RegionsByCountry } from '../../../../../src/microservice/domain/model/regions/regions-by-country.model';
import { mockJwtGuard } from '../../../../mock/services/jwt/jwt-service.mock';
import { JwtAuthGuard } from '../../../../../src/microservice/domain/jwt/jwt-auth.guard';

describe('RegionsController', () => {
  let regionsController: RegionsController;

  const mockRegions = () => {
    const region = new RegionsByCountry();
    region.name = 'any';

    const region2 = new RegionsByCountry();
    region2.name = 'any';
    return [region, region2];
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        }),
        ExtensionsModule
      ],
      controllers: [RegionsController],
      providers: [
        {
          provide: RegionsByCountryService,
          useFactory: () => mockFinderSeederService
        }
      ]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .compile();

    regionsController = app.get<RegionsController>(RegionsController);
  });

  describe('seedNeighborhoodsByState', () => {
    it('should call seedNeighborhoodsByState and return an array', async () => {
      const getServiceStub = sinon
        .stub(mockFinderSeederService, 'getFindAndSeedElements')
        .returns(mockRegions());

      const actual = await regionsController.getRegionsByCountry(null);

      expect(actual.body).to.be.an('array').that.contains;
      expect(actual.body).to.have.lengthOf(2);

      getServiceStub.restore();
    });
  });
});
