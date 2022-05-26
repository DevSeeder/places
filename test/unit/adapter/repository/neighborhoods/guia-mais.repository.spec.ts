import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { GuiaMaisRepository } from '../../../../../src/adapter/repository/neighborhoods/guia-mais.repository';
import { PuppeteerModule } from 'nest-puppeteer';
import { SearchNeighborhoods } from '../../../../../src/domain/model/search/search-neighborhoods.model';
import * as fs from 'fs';
import { ExtensionsModule } from '../../../../../src/adapter/helper/extensions/exensions.module';
import * as cheerio from 'cheerio';

jest.useFakeTimers();
jest.setTimeout(50000);

describe('GuiaMaisRepository', () => {
  let sut: GuiaMaisRepository;
  let app: TestingModule;

  const mockHTML = fs.readFileSync(
    './test/mock/html/repository/neighborhoods/guia-mais_neighborhoods_orleans.html',
    {
      encoding: 'utf8',
      flag: 'r'
    }
  );

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [
        ExtensionsModule,
        PuppeteerModule.forRoot({
          isGlobal: true
        })
      ],
      controllers: [],
      providers: [
        GuiaMaisRepository,
        {
          provide: ConfigService,
          useValue: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            get<String>(key: string): string {
              return 'any_url';
            }
          }
        }
      ]
    }).compile();

    sut = app.get<GuiaMaisRepository>(GuiaMaisRepository);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('getNeighborhoodsByCity', () => {
    it('should call getNeighborhoodsByCity and return an array', async () => {
      const mockSearchParams = new SearchNeighborhoods(
        'brasil',
        'sc',
        'orleans'
      );
      const getDataHtmlStub = sinon.stub(sut, 'getDataHtml').returns(mockHTML);
      const goToUrlStub = sinon.stub(sut, 'goToUrl').returns();

      const actual = await sut.getNeighborhoodsByCity(mockSearchParams);

      expect(actual).to.be.an('array').that.is.not.empty;
      expect(actual[0].city).to.be.equal('Orleans - SC');
      expect(actual[0].name).to.be.equal('6 Marias');

      getDataHtmlStub.restore();
      goToUrlStub.restore();
    });
  });

  describe('callEndpoint', () => {
    it('should call callEndpoint and call getDocumentHtml with the correct params', async () => {
      const mockSearchParams = new SearchNeighborhoods(
        'brasil',
        'sc',
        'orleans'
      );
      const getDataHtmlStub = sinon.stub(sut, 'getDataHtml').returns(mockHTML);
      const getDocumentHtmlspy = sinon.spy(sut, 'getDocumentHtml');
      const goToUrlStub = sinon.stub(sut, 'goToUrl').returns();

      const actual = await sut.callEndpoint(mockSearchParams);

      sinon.assert.calledOnceWithExactly(
        getDocumentHtmlspy,
        'any_url/orleans-sc'
      );

      expect(actual().toString()).to.be.equal(
        cheerio.load(mockHTML)().toString()
      );

      getDataHtmlStub.restore();
      getDocumentHtmlspy.restore();
      goToUrlStub.restore();
    });
  });
});
