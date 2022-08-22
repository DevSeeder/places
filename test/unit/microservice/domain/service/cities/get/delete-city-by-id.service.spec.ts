import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { CitiesMongoose } from '../../../../../../../src/microservice/adapter/repository/cities/cities-mongoose.repository';
import { DeleteCityByIdService } from '../../../../../../../src/microservice/domain/service/cities/delete-city-by-id.service';
import { mockModelMongoose } from '../../../../../../mock/mongoose/mock-mongoose';

describe('DeleteCityByIdService', () => {
  let sut: DeleteCityByIdService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        {
          provide: CitiesMongoose,
          useValue: mockModelMongoose
        },
        DeleteCityByIdService
      ]
    }).compile();

    sut = app.get<DeleteCityByIdService>(DeleteCityByIdService);
  });

  describe('deleteCityById', () => {
    it('should call deleteCityById and call mongoose deleteOneById', async () => {
      const deleteStub = sinon.stub(mockModelMongoose, 'deleteOneById');
      await sut.deleteCityById(1);

      sinon.assert.calledOnceWithExactly(deleteStub, 1);

      deleteStub.restore();
    });
  });
});
