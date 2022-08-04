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
        }
      ]
    }).compile();

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
});
