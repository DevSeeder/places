import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../../../src/config/configuration';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ExtensionsModule } from '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { SearchNeighborhoodsDTO } from '../../../../../src/microservice/domain/model/search/neighborhoods/search-neighborhoods-dto.model';
import { SeedNeighborhoodsByStateService } from '../../../../../src/microservice/domain/service/seed/neighborhoods/seed-neighborhoods-by-state.service';
import { SeedController } from '../../../../../src/microservice/adapter/controller/seed.controller';
import { SenderMessageService } from '../../../../../src/microservice/domain/service/amqp/sender-message.service';
import { mockSenderMessageService } from '../../../../mock/services/amqp/sender-message-service.mock';
import { SeedNeighborhoodsByCountryService } from '../../../../../src/microservice/domain/service/seed/neighborhoods/seed-neighborhoods-by-country.service';
import { mockSeedNeighborhoodsByCountryService } from '../../../../mock/services/seed/seed-neighborhoods-service.mock';
import { GetLogSeedByCityService } from '../../../../../src/microservice/domain/service/logseed/get-log-seed-by-city.service';
import { mockGetLogSeedByCityService } from '../../../../mock/services/logseed/log-seed-service.mock';
import { mockJwtGuard } from '../../../../mock/services/jwt/jwt-service.mock';
import { JwtAuthGuard } from '../../../../../src/microservice/domain/jwt/jwt-auth.guard';

describe('SeedController', () => {
  let sut: SeedController;

  const mockSeedNeighborhoodsByStateService = {
    seedNeighborhoodsByState: () => {
      return;
    }
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
      controllers: [SeedController],
      providers: [
        {
          provide: SeedNeighborhoodsByStateService,
          useFactory: () => mockSeedNeighborhoodsByStateService
        },
        {
          provide: SenderMessageService,
          useFactory: () => mockSenderMessageService
        },
        {
          provide: SeedNeighborhoodsByCountryService,
          useFactory: () => mockSeedNeighborhoodsByCountryService
        },
        {
          provide: GetLogSeedByCityService,
          useFactory: () => mockGetLogSeedByCityService
        }
      ]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .compile();

    sut = app.get<SeedController>(SeedController);
  });

  describe('seedNeighborhoodsByState', () => {
    it('should call seedNeighborhoodsByState and return a response', async () => {
      const mockResponseSeed = {
        success: true,
        response: 'Seed Requested'
      };

      const seedServiceStub = sinon
        .stub(mockSeedNeighborhoodsByStateService, 'seedNeighborhoodsByState')
        .returns(mockResponseSeed);

      const searchParams = new SearchNeighborhoodsDTO('brasil', 'sc');

      const actual = await sut.seedNeighborhoodsByState(searchParams);

      expect(actual.body.success).to.be.equal(true);
      expect(actual.body.response).to.be.equal('Seed Requested');

      seedServiceStub.restore();
    });
  });

  describe('seedNeighborhoodsByCountry', () => {
    it('should call seedNeighborhoodsByCountry and return a response', async () => {
      const mockResponseSeed = {
        success: true,
        response: 'Seed Requested'
      };

      const seedServiceStub = sinon
        .stub(
          mockSeedNeighborhoodsByCountryService,
          'seedNeighborhoodsByCountry'
        )
        .returns(mockResponseSeed);

      const actual = await sut.seedNeighborhoodsByCountry('brasil');

      expect(actual.body.success).to.be.equal(true);
      expect(actual.body.response).to.be.equal('Seed Requested');

      seedServiceStub.restore();
    });
  });
});
