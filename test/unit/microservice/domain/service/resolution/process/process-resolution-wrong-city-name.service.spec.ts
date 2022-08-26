import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { LogActionService } from '../../../../../../../src/microservice/domain/service/logactions/log-action.service';
import { mockLogActionsService } from '../../../../../../mock/services/logactions/logactions-service.mock';
import { mockLogSeed } from '../../../../../../mock/schemas/logseed-schema.mock';
import { mockRefResolution } from '../../../../../../mock/models/reference/reference-resolution.mock';
import { ProcessResolutionWrongCityNameService } from '../../../../../../../src/microservice/domain/service/resolution/process/city/process-resolution-wrong-city-name.service';
import { UpdateCityByIdService } from '../../../../../../../src/microservice/domain/service/cities/update-city-by-id.service';
import { mockUpdateCityByIdService } from '../../../../../../mock/services/cities/cities-service.mock';

describe('ProcessResolutionWrongCityNameService', () => {
  let sut: ProcessResolutionWrongCityNameService;

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
          provide: UpdateCityByIdService,
          useFactory: () => mockUpdateCityByIdService
        },
        ProcessResolutionWrongCityNameService
      ]
    }).compile();

    sut = app.get<ProcessResolutionWrongCityNameService>(
      ProcessResolutionWrongCityNameService
    );
  });

  describe('process', () => {
    it('should call process and call updateCityById correctly', async () => {
      const processActionSpy = sinon.spy(
        mockUpdateCityByIdService,
        'updateCityById'
      );

      await sut.process(mockLogSeed(), mockRefResolution(), null);

      sinon.assert.calledOnceWithExactly(
        processActionSpy,
        5,
        {
          name: 'any'
        },
        { $push: { alias: 'any' } }
      );

      processActionSpy.restore();
    });
  });
});
