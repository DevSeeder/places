import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { ProcessResolutionIsNotACityService } from '../../../../../../../src/microservice/domain/service/resolution/process/city/process-resolution-is-not-a-city.service';
import { LogActionService } from '../../../../../../../src/microservice/domain/service/logactions/log-action.service';
import { mockLogActionsService } from '../../../../../../mock/services/logactions/logactions-service.mock';
import { DeleteCityByIdService } from '../../../../../../../src/microservice/domain/service/cities/delete-city-by-id.service';
import { mockDeleteCityService } from '../../../../../../mock/services/cities/cities-service.mock';
import { mockLogSeed } from '../../../../../../mock/schemas/logseed-schema.mock';
import { mockRefResolution } from '../../../../../../mock/models/reference/reference-resolution.mock';

describe('ProcessResolutionIsNotACityService', () => {
  let sut: ProcessResolutionIsNotACityService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: LogActionService,
          useValue: mockLogActionsService
        },
        {
          provide: DeleteCityByIdService,
          useFactory: () => mockDeleteCityService
        },
        ProcessResolutionIsNotACityService
      ]
    }).compile();

    sut = app.get<ProcessResolutionIsNotACityService>(
      ProcessResolutionIsNotACityService
    );
  });

  describe('process', () => {
    it('should call process and call deleteCityById correctly', async () => {
      const processActionSpy = sinon.spy(
        mockDeleteCityService,
        'deleteCityById'
      );

      await sut.process(mockLogSeed(), mockRefResolution(), null);

      sinon.assert.calledOnceWithExactly(processActionSpy, 5);

      processActionSpy.restore();
    });
  });
});
