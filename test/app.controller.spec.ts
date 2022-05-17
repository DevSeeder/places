import { Test, TestingModule } from '@nestjs/testing';
import { BairrosController } from '../src/bairros/bairros.controller';
import { BairrosService } from '../src/bairros/bairros.service';

describe('BairrosController', () => {
  let bairrosController: BairrosController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BairrosController],
      providers: [BairrosService],
    }).compile();

    bairrosController = app.get<BairrosController>(BairrosController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(bairrosController.getHello()).toBe('Hello World!');
    });
  });
});
