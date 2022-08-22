import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { UpdateCityByIdService } from '../../../../../../../src/microservice/domain/service/cities/update-city-by-id.service';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { CitiesMongoose } from '../../../../../../../src/microservice/adapter/repository/cities/cities-mongoose.repository';
import { mockModelMongoose } from '../../../../../../mock/mongoose/mock-mongoose';

describe('UpdateCityByIdService', () => {
  let sut: UpdateCityByIdService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: CitiesMongoose,
          useValue: mockModelMongoose
        },
        UpdateCityByIdService
      ]
    }).compile();

    sut = app.get<UpdateCityByIdService>(UpdateCityByIdService);
  });

  describe('updateCityById', () => {
    it('should call updateCityById and call mongoose updateById', async () => {
      const deleteStub = sinon.stub(mockModelMongoose, 'updateById');
      await sut.updateCityById(1, {});

      sinon.assert.calledOnceWithExactly(deleteStub, 1, {});

      deleteStub.restore();
    });
  });
});
