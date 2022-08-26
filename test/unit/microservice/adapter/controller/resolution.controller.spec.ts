import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../../../src/config/configuration';
import * as sinon from 'sinon';
import { ExtensionsModule } from '../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { ResolutionController } from '../../../../../src/microservice/adapter/controller/resolutions.controller';
import { ResolutionService } from '../../../../../src/microservice/domain/service/resolution/resolution.service';
import { mockRefResolution } from '../../../../mock/models/reference/reference-resolution.mock';
import { mockJwtGuard } from '../../../../mock/services/jwt/jwt-service.mock';
import { JwtAuthGuard } from '../../../../../src/core/auth/jwt/jwt-auth.guard';

describe('ResolutionController', () => {
  let sut: ResolutionController;

  const mockResolutionService = {
    requestResolution: () => {
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
      controllers: [ResolutionController],
      providers: [
        {
          provide: ResolutionService,
          useFactory: () => mockResolutionService
        }
      ]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .compile();

    sut = app.get<ResolutionController>(ResolutionController);
  });

  describe('requestResolution', () => {
    it('should call requestResolution correctly', async () => {
      const resolutionStub = sinon.stub(
        mockResolutionService,
        'requestResolution'
      );

      await sut.requestResolution(mockRefResolution());

      sinon.assert.calledOnceWithExactly(resolutionStub, mockRefResolution());

      resolutionStub.restore();
    });
  });
});
