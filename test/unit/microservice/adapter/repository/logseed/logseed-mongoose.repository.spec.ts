import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ExtensionsModule } from '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { getModelToken } from '@nestjs/mongoose';
import { mockModelMongoose } from '../../../../../mock/mongoose/mock-mongoose';
import { LogSeedMongoose } from '../../../../../../src/microservice/adapter/repository/logseed/logseed-mongoose.repository';
import { LogSeed } from '../../../../../../src/microservice/domain/schemas/logseed.schema';

jest.useFakeTimers();
jest.setTimeout(20000);

describe('LogSeedMongoose', () => {
  let sut: LogSeedMongoose;
  let app: TestingModule;

  const mockLog = () => {
    const log = new LogSeed();
    return log;
  };

  const mockFindById = {
    select: jest.fn(() => {
      return {
        lean: jest.fn(() => {
          return {
            exec: jest.fn(() => mockLog())
          };
        }),
        exec: jest.fn(() => mockLog())
      };
    })
  };

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [ExtensionsModule],
      controllers: [],
      providers: [
        LogSeedMongoose,
        {
          provide: getModelToken(LogSeed.name),
          useValue: mockModelMongoose
        }
      ]
    }).compile();

    sut = app.get<LogSeedMongoose>(LogSeedMongoose);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('findById', () => {
    it('should call findById and return an array with default select', async () => {
      const findManyStub = sinon
        .stub(mockModelMongoose, 'findById')
        .returns(mockFindById);

      const actual = await sut.findById('id');

      expect(JSON.stringify(actual)).to.be.equal(JSON.stringify(mockLog()));

      findManyStub.restore();
    });

    it('should call findById and return an array with select param', async () => {
      const findManyStub = sinon
        .stub(mockModelMongoose, 'findById')
        .returns(mockFindById);

      const actual = await sut.findById('id', {
        any: 'any'
      });

      expect(JSON.stringify(actual)).to.be.equal(JSON.stringify(mockLog()));

      findManyStub.restore();
    });
  });
});
