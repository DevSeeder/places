import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ExtensionsModule } from '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { getModelToken } from '@nestjs/mongoose';
import { mockModelMongoose } from '../../../../../mock/mongoose/mock-mongoose';
import { StatesMongoose } from '../../../../../../src/microservice/adapter/repository/states/states-mongoose.repository';
import { State } from '../../../../../../src/microservice/domain/schemas/state.schema';

jest.useFakeTimers();
jest.setTimeout(20000);

describe('StatesMongoose', () => {
  let sut: StatesMongoose;
  let app: TestingModule;

  const mockStates = () => {
    const arr = [];
    const item1 = new State();
    item1.name = 'Santa Catarina';
    arr.push(item1);

    return arr;
  };

  const mockFind = {
    lean: jest.fn(() => {
      return {
        exec: jest.fn(() => mockStates())
      };
    }),
    select: jest.fn(() => {
      return {
        lean: jest.fn(() => {
          return {
            exec: jest.fn(() => mockStates())
          };
        })
      };
    })
  };

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [ExtensionsModule],
      controllers: [],
      providers: [
        StatesMongoose,
        {
          provide: getModelToken(State.name),
          useValue: mockModelMongoose
        }
      ]
    }).compile();

    sut = app.get<StatesMongoose>(StatesMongoose);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('findByNameOrAliasOrId', () => {
    it('should call findByNameOrAliasOrId and return an array', async () => {
      const findManyStub = sinon
        .stub(mockModelMongoose, 'find')
        .returns(mockFind);

      const actual = await sut.findByNameOrAliasOrId('any');

      expect(actual).to.be.an('array').that.is.not.empty;

      findManyStub.restore();
    });
  });

  describe('updateById', () => {
    it('should call updateById and call mongoose findOneAndUpdate', async () => {
      const mongooseStub = sinon.stub(mockModelMongoose, 'findOneAndUpdate');
      const updateSpy = sinon.spy(sut, 'updateOne');

      await sut.updateById(null, {});

      sinon.assert.calledOnce(mongooseStub);
      sinon.assert.calledOnceWithExactly(updateSpy, { id: null }, {});

      mongooseStub.restore();
      updateSpy.restore();
    });
  });
});
