import { HttpStatus } from '@nestjs/common';
import { NeighborhoodsModule } from '../../../../src/microservice/adapter/neighborhoods.module';
import { Test, TestingModule } from '@nestjs/testing';
import { NeighborhoodsController } from '../../../../src/microservice/adapter/controller/neighborhoods.controller';
import { ExtensionsModule } from '../../../../src/microservice/adapter/helper/extensions/exensions.module';

describe('NeighborhoodsModule', () => {
  let sut: NeighborhoodsController;
  let app: TestingModule;

  const mockGuiaMaisRepository = {
    getNeighborhoodsByCity() {
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
      .compile();

    sut = app.get<NeighborhoodsController>(NeighborhoodsController);
  });

  describe('NeighborhoodsController', function () {
    it('should call buildResponse for status 200', async function () {
      const actual = await sut.buildResponse(HttpStatus.OK, {});
      expect(actual.status).toBe(HttpStatus.OK);
    });
  });
});
