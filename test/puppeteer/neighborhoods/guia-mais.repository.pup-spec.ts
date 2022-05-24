import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../src/config/configuration';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { GuiaMaisRepository } from '../../../src/adapter/repository/neighborhoods/guia-mais.repository';
import { PuppeteerModule } from 'nest-puppeteer';
import { SearchNeighborhoods } from '../../../src/domain/model/search-neighborhoods.model';
import * as fs from 'fs';
import { ExtensionsModule } from '../../../src/adapter/helper/extensions/exensions.module';

jest.useFakeTimers();
jest.setTimeout(50000);

describe('GuiaMaisRepository', () => {
  let sut: GuiaMaisRepository;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [
        ExtensionsModule,
        PuppeteerModule.forRoot({
          isGlobal: true
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration]
        })
      ],
      controllers: [],
      providers: [GuiaMaisRepository]
    }).compile();

    sut = app.get<GuiaMaisRepository>(GuiaMaisRepository);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GuiaMaisRepository', () => {
    it('should call getNeighborhoodsByCity and return an array', async () => {
      const mockHTML = await fs.readFileSync(
        './test/mock/html/repository/neighborhoods/guia-mais_neighborhoods_orleans.html',
        {
          encoding: 'utf8',
          flag: 'r'
        }
      );

      const mockSearchParams = new SearchNeighborhoods(
        'brasil',
        'sc',
        'orleans'
      );
      const guiaMaisStub = sinon.stub(sut, 'getDataHtml').returns(mockHTML);

      const actual = await sut.getNeighborhoodsByCity(mockSearchParams);

      expect(actual).to.be.an('array');
      //   expect(actual.length).to.be.not.empty();

      guiaMaisStub.restore();
    });
  });
});
