import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { GuiaMaisRepository } from '../../../../../../../src/microservice/adapter/repository/neighborhoods/puppeteer/guia-mais.repository';
import { PuppeteerModule } from 'nest-puppeteer';
import { SearchNeighborhoodsDTO } from '../../../../../../../src/microservice/domain/model/search/neighborhoods/search-neighborhoods-dto.model';
import * as fs from 'fs';
import { ExtensionsModule } from '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import * as cheerio from 'cheerio';
import { Country } from '../../../../../../../src/microservice/domain/schemas/country.schema';
import { State } from '../../../../../../../src/microservice/domain/schemas/state.schema';
import { City } from '../../../../../../../src/microservice/domain/schemas/city.schema';
import { PuppeteerService } from '../../../../../../../src/microservice/domain/service/puppeteer/puppeteer.service';
import { mockPuppeteerService } from '../../../../../../mock/services/puppeteer/puppeteer-service.mock';

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

  const mockConvertedSearch = () => {
    const mockCountry = new Country();
    mockCountry.name = 'USA';
    const mockState = new State();
    mockState.name = 'New York';
    mockState.stateCode = 'NY';
    const mockCity = new City();
    mockCity.name = 'New York City';
    return {
      country: mockCountry,
      state: mockState,
      city: mockCity
    };
  };

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
        },
        {
          provide: PuppeteerService,
          useValue: mockPuppeteerService
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
      const mockSearchParams = new SearchNeighborhoodsDTO(
        'brasil',
        'sc',
        'orleans'
      );
      const getDataHtmlStub = sinon
        .stub(mockPuppeteerService, 'tryCollectData')
        .returns(mockHTML);

      const actual = await sut.getElements(
        mockSearchParams,
        mockConvertedSearch()
      );

      expect(actual).to.be.an('array').that.is.not.empty;
      expect(actual[0].city).to.be.equal('Orleans - SC');
      expect(actual[0].name).to.be.equal('6 Marias');

      getDataHtmlStub.restore();
    });
  });

  describe('callEndpoint', () => {
    it('should call callEndpoint and call getDocumentHtml with the correct params', async () => {
      const mockSearchParams = new SearchNeighborhoodsDTO(
        'brasil',
        'sc',
        'orleans'
      );
      const getDataHtmlStub = sinon
        .stub(mockPuppeteerService, 'tryCollectData')
        .returns(mockHTML);

      const getDocumentHtmlspy = sinon.spy(sut, 'getDocumentHtml');

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
    });
  });

  describe('callEndpoint', () => {
    it('should call callEndpoint and call getDocumentHtml with the correct params', async () => {
      try {
        sut.validateOutput([]);
      } catch (err) {
        expect(err.message).to.be.equal('Neighborhoods not found');
      }
    });
  });
});
