import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { LogSeedJobService } from '../../../../../../src/microservice/domain/service/logseed/log-seed-job.service';
import { LogSeedMongoose } from '../../../../../../src/microservice/adapter/repository/logseed/logseed-mongoose.repository';
import { NotFoundException } from '../../../../../../src/core/error-handling/exception/not-found.exception';
import { EnumTypeLogSeed } from '../../../../../../src/microservice/domain/enumerators/enum-type-logseed';
import { Country } from '../../../../../../src/microservice/domain/schemas/country.schema';
import { Translations } from '../../../../../../src/microservice/domain/model/translations.model';
import { EnumTranslations } from '../../../../../../src/microservice/domain/enumerators/enum-translations.enumerator';
import { State } from '../../../../../../src/microservice/domain/schemas/state.schema';
import { City } from '../../../../../../src/microservice/domain/schemas/city.schema';
import { ReferenceNeighborhoodsByState } from '../../../../../../src/microservice/domain/model/logseed/reference/reference-neighborhoods-by-state.model';

describe('LogSeedJobService', () => {
  let sut: LogSeedJobService;

  const mockMongooseRepository = {
    insertOne: () => {
      return;
    }
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: LogSeedMongoose,
          useValue: mockMongooseRepository
        },
        LogSeedJobService
      ]
    }).compile();

    sut = app.get<LogSeedJobService>(LogSeedJobService);
  });

  const country = new Country();
  country.id = 31;
  country.name = 'Brazil';
  country.translations = new Translations();
  country.translations[EnumTranslations.BR] = 'brasil';
  const state = new State();
  state.id = 2014;
  state.name = 'Santa Catarina';
  state.stateCode = 'SC';
  const city = new City();
  city.id = 1;
  city.name = 'Orleans';

  const reference = new ReferenceNeighborhoodsByState(
    31,
    2014,
    1,
    'Brazil',
    'Santa Catarina',
    'Orleans'
  );
  const mockError = new NotFoundException('Neighborhoods');

  describe('logSeedByState', () => {
    it('should call createLogSeed and call insertOne correctly', async () => {
      const insertOneStub = sinon.stub(mockMongooseRepository, 'insertOne');
      const createLogSeedSpy = sinon.spy(sut, 'createLogSeed');

      await sut.logSeedByState(country, state, city, mockError);

      sinon.assert.calledOnceWithExactly(
        createLogSeedSpy,
        EnumTypeLogSeed.NeighborhoodsByState,
        reference,
        mockError
      );

      sinon.assert.calledOnce(insertOneStub);

      insertOneStub.restore();
      createLogSeedSpy.restore();
    });
  });
});
