import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { expect } from 'chai';
import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { LogSeedMongoose } from '../../../../../../src/microservice/adapter/repository/logseed/logseed-mongoose.repository';
import { Country } from '../../../../../../src/microservice/domain/schemas/country.schema';
import { LogSeed } from '../../../../../../src/microservice/domain/schemas/logseed.schema';
import { Translations } from '../../../../../../src/microservice/domain/model/translations.model';
import { EnumTranslations } from '../../../../../../src/microservice/domain/enumerators/enum-translations.enumerator';
import { State } from '../../../../../../src/microservice/domain/schemas/state.schema';
import { City } from '../../../../../../src/microservice/domain/schemas/city.schema';
import { ReferenceNeighborhoodsByState } from '../../../../../../src/microservice/domain/model/logseed/reference/reference-neighborhoods-by-state.model';
import { GetLogSeedByIdService } from '../../../../../../src/microservice/domain/service/logseed/get-log-seed-by-id.service';
import { EnumTypeLogSeed } from '../../../../../../src/microservice/domain/enumerators/enum-type-logseed';

describe('GetLogSeedByIdService', () => {
  let sut: GetLogSeedByIdService;

  const mockMongooseRepository = {
    findById: () => {
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
        GetLogSeedByIdService
      ]
    }).compile();

    sut = app.get<GetLogSeedByIdService>(GetLogSeedByIdService);
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

  const mockLogSeed = (): LogSeed => {
    const logSeed = new LogSeed();
    logSeed.datetime = new Date();
    logSeed.reference = reference;
    logSeed.type = EnumTypeLogSeed.NeighborhoodsByState;
    return logSeed;
  };

  describe('getLogSeedById', () => {
    it('should call getLogSeedById and return an array', async () => {
      const getLogSeedStub = sinon
        .stub(mockMongooseRepository, 'findById')
        .returns(mockLogSeed());

      const actual = await sut.getLogSeedById('any');

      expect(actual.reference).to.be.equal(mockLogSeed().reference);

      getLogSeedStub.restore();
    });
  });
});
