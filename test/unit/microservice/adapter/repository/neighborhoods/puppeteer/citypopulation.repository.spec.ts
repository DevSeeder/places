import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { PuppeteerModule } from 'nest-puppeteer';
import * as fs from 'fs';
import { ExtensionsModule } from '../../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import * as cheerio from 'cheerio';
import { Country } from '../../../../../../../src/microservice/domain/schemas/country.schema';
import { CityPopulationRepository } from '../../../../../../../src/microservice/adapter/repository/regions/puppeteer/citypopulation.repository';
import { SearchRegionsDTO } from '../../../../../../../src/microservice/domain/model/search/regions/search-regions-dto.model';

jest.useFakeTimers();
jest.setTimeout(50000);

describe('CityPopulationRepository', () => {
  let sut: CityPopulationRepository;
  let app: TestingModule;

  const mockHTML = fs.readFileSync(
    './test/mock/html/repository/regions/citypopulation_regions_brazil.html',
    {
      encoding: 'utf8',
      flag: 'r'
    }
  );

  const mockHTMLStates = fs.readFileSync(
    './test/mock/html/repository/regions/citypopulation_regions_brazil_south.html',
    {
      encoding: 'utf8',
      flag: 'r'
    }
  );

  const mockCountry = new Country();
  mockCountry.name = 'brazil';

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
        CityPopulationRepository,
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

    sut = app.get<CityPopulationRepository>(CityPopulationRepository);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('getElements', () => {
    it('should call getElements and return an array', async () => {
      const mockSearchParams = new SearchRegionsDTO('brazil');
      const getDataHtmlStub = sinon.stub(sut, 'getDataHtml').returns(mockHTML);
      const goToUrlStub = sinon.stub(sut, 'goToUrl').returns();
      const goToStatesStub = sinon
        .stub(sut, 'goToRegionAndGetStates')
        .returns(['any']);

      const actual = await sut.getElements(mockSearchParams, mockCountry);

      expect(actual).to.be.an('array').that.is.not.empty;
      expect(actual[0].name).to.be.equal('Central-West');
      expect(actual[0].states[0]).to.be.equal('any');

      getDataHtmlStub.restore();
      goToUrlStub.restore();
      goToStatesStub.restore();
    });
  });

  describe('goToRegionAndGetStates', () => {
    it('should call goToRegionAndGetStates and return an array', async () => {
      const getDataHtmlStub = sinon
        .stub(sut, 'getDataHtml')
        .returns(mockHTMLStates);
      const goToUrlStub = sinon.stub(sut, 'goToUrl').returns();

      const actual = await sut.goToRegionAndGetStates('any_url');

      expect(actual).to.be.an('array').that.is.not.empty;
      expect(actual[0]).to.be.equal('Paraná');
      expect(actual[1]).to.be.equal('Rio Grande do Sul');
      expect(actual[2]).to.be.equal('Santa Catarina');

      getDataHtmlStub.restore();
      goToUrlStub.restore();
    });
  });

  describe('callEndpoint', () => {
    it('should call callEndpoint and call getDocumentHtml with the correct params', async () => {
      const mockSearchParams = new SearchRegionsDTO('brazil');
      const getDataHtmlStub = sinon.stub(sut, 'getDataHtml').returns(mockHTML);
      const getDocumentHtmlspy = sinon.spy(sut, 'getDocumentHtml');
      const goToUrlStub = sinon.stub(sut, 'goToUrl').returns();

      const actual = await sut.callEndpoint(mockSearchParams, mockCountry);

      sinon.assert.calledOnceWithExactly(
        getDocumentHtmlspy,
        'any_url/en/brazil'
      );

      expect(actual().toString()).to.be.equal(
        cheerio.load(mockHTML)().toString()
      );

      getDataHtmlStub.restore();
      getDocumentHtmlspy.restore();
      goToUrlStub.restore();
    });
  });

  describe('callEndpoint', () => {
    it('should call callEndpoint and call getDocumentHtml with the correct params', async () => {
      try {
        sut.validateOutput([]);
      } catch (err) {
        expect(err.message).to.be.equal('Regions not found');
      }
    });
  });
});
