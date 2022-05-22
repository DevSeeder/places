// import { Test, TestingModule } from '@nestjs/testing';
// import { PuppeteerModule } from 'nest-puppeteer';
// import { GuiaMaisRepository } from '../src/adapter/repository/guia-mais.repository';
// import { NeighborhoodsController } from '../src/adapter/controller/neighborhoods.controller';
// import { NeighborhoodsService } from '../src/adapter/service/neighborhoods.service';
// import * as sinon from 'sinon';

// describe('NeighborhoodsController', () => {
//   let neighborhoodsController: NeighborhoodsController;

//   beforeEach(async () => {
//     const app: TestingModule = await Test.createTestingModule({
//       imports: [PuppeteerModule.forFeature()],
//       controllers: [NeighborhoodsController],
//       providers: [
//         {
//           provide: 'GuiaMaisRepository',
//           useFactory: () => {
//             GuiaMaisRepository;
//           }
//         },
//         NeighborhoodsService
//       ]
//     }).compile();

//     neighborhoodsController = app.get<NeighborhoodsController>(
//       NeighborhoodsController
//     );
//   });

//   describe('root', () => {
//     it('should return "Hello World!"', async () => {
//       const guiaMaisStub = sinon.stub();
//       const actual = await neighborhoodsController.getNeighborhoodsByCity(
//         'brasil',
//         'sc',
//         'orleans'
//       );
//     });
//   });
// });
