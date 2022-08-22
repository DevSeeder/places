import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { LogActionService } from '../../../../../../../src/microservice/domain/service/logactions/log-action.service';
import { mockLogActionsService } from '../../../../../../mock/services/logactions/logactions-service.mock';
import { mockLogSeed } from '../../../../../../mock/schemas/logseed-schema.mock';
import { mockRefResolution } from '../../../../../../mock/models/reference/reference-resolution.mock';
import { ProcessResolutionUniqueNeighborhoodService } from '../../../../../../../src/microservice/domain/service/resolution/process/city/process-resolution-unique-neighborhood.service';
import {
  mockValidateService,
  mockValidateStateService
} from '../../../../../../mock/services/validate/validate-service.mock';
import { ValidateInputParamsService } from '../../../../../../../src/microservice/domain/service/validate/validate-input-params.service';
import { ValidateStateByNameOrAliasService } from '../../../../../../../src/microservice/domain/service/states/validate-state-by-name-or-alias.service';
import { SaveNeighborhoodsByCityService } from '../../../../../../../src/microservice/domain/service/neighborhoods/save-neighborhoods-by-city.service';
import { mockSaveNeighborhoodsService } from '../../../../../../mock/services/neighborhoods/neighborhoods-service.mock';
import { Neighborhood } from '../../../../../../../src/microservice/domain/schemas/neighborhood.schema';
import { ValidOutputSearchByCityBuilder } from '../../../../../../../src/microservice/adapter/helper/builder/valid/valid-output-search-by-city.builder';
import { ReferenceNeighborhoodsByState } from '../../../../../../../src/microservice/domain/model/references/reference-neighborhoods-by-state.model';

describe('ProcessResolutionUniqueNeighborhoodService', () => {
  let sut: ProcessResolutionUniqueNeighborhoodService;

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
          provide: ValidateInputParamsService,
          useFactory: () => mockValidateService
        },
        {
          provide: ValidateStateByNameOrAliasService,
          useFactory: () => mockValidateStateService
        },
        {
          provide: SaveNeighborhoodsByCityService,
          useFactory: () => mockSaveNeighborhoodsService
        },
        ProcessResolutionUniqueNeighborhoodService
      ]
    }).compile();

    sut = app.get<ProcessResolutionUniqueNeighborhoodService>(
      ProcessResolutionUniqueNeighborhoodService
    );
  });

  describe('process', () => {
    it('should call process and call createNeighborhood correctly', async () => {
      const processActionSpy = sinon.spy(
        mockSaveNeighborhoodsService,
        'createNeighborhood'
      );

      const reference = new ReferenceNeighborhoodsByState(
        31,
        2014,
        1,
        'Brazil',
        'Santa Catarina',
        'Orleans'
      );

      const convertedSearch = new ValidOutputSearchByCityBuilder(
        reference
      ).build();
      convertedSearch.state.stateCode = 'SC';

      const mockLog = mockLogSeed();
      mockLog.reference = reference;

      await sut.process(mockLog, mockRefResolution(), null);

      const mockNeighborhood = new Neighborhood();
      mockNeighborhood.name = 'any';

      sinon.assert.calledOnceWithExactly(
        processActionSpy,
        mockNeighborhood,
        convertedSearch
      );

      processActionSpy.restore();
    });
  });
});
