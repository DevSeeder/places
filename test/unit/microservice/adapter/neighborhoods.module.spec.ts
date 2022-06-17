import { HttpStatus } from '@nestjs/common';
import { NeighborhoodsModule } from '../../../../src/microservice/adapter/neighborhoods.module';
import { Test, TestingModule } from '@nestjs/testing';
import { NeighborhoodsController } from '../../../../src/microservice/adapter/controller/neighborhoods.controller';
import { ExtensionsModule } from '../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { NeighborhoodsMongoose } from '../../../../src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Neighborhood } from '../../../../src/microservice/domain/schemas/neighborhood.schema';
import { mockModelMongoose } from '../../../mock/mongoose/mockMongooseModel';

describe('NeighborhoodsModule', () => {
  let sut: NeighborhoodsController;
  let app: TestingModule;

  const mockGuiaMaisRepository = {
    getNeighborhoodsByCity() {
      return;
    }
  };

  const mockMongooseRepository = {
    findBySearchParams: () => {
      return [];
    },
    insert: () => {
      return;
    }
  };

  beforeEach(async function () {
    app = await Test.createTestingModule({
      imports: [NeighborhoodsModule, ExtensionsModule],
      providers: []
    })
      .overrideProvider('GuiaMaisRepository')
      .useValue(mockGuiaMaisRepository)
      .overrideProvider(NeighborhoodsMongoose)
      .useValue(mockMongooseRepository)
      .overrideProvider(getModelToken(Neighborhood.name))
      .useValue(mockModelMongoose)
      .compile();

    sut = app.get<NeighborhoodsController>(NeighborhoodsController);
  });

  describe('res', function () {
    it('should call buildResponse for status 200', async function () {
      const actual = await sut.buildResponse(HttpStatus.OK, {});
      expect(actual.status).toBe(HttpStatus.OK);
    });
  });
});
