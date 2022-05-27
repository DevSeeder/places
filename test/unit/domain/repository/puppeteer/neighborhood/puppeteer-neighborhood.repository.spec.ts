import { Test, TestingModule } from '@nestjs/testing';
import { PuppeteerModule } from 'nest-puppeteer';
import { SearchNeighborhoods } from '../../../../../../src/places-interface/domain/model/search/search-neighborhoods.model';
import { ExtensionsModule } from '../../../../../../src/places-interface/adapter/helper/extensions/exensions.module';
import { PuppeteerNeighborhoodRepository } from '../../../../../../src/places-interface/domain/repository/puppeteer/neighborhood/puppeteer-neighborhood.repository';
import { expect } from 'chai';
import * as sinon from 'sinon';

jest.useFakeTimers();
jest.setTimeout(50000);

class mockExtendClass extends PuppeteerNeighborhoodRepository {}

describe('PuppeteerNeighborhoodRepository', () => {
  let sut: PuppeteerNeighborhoodRepository;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [
        ExtensionsModule,
        PuppeteerModule.forRoot({
          isGlobal: true
        })
      ],
      controllers: [],
      providers: [mockExtendClass]
    }).compile();

    sut = app.get<mockExtendClass>(mockExtendClass);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('buildElementFromDocument', () => {
    it('should call getEndpoint and throws a error', async () => {
      const mockSearch = new SearchNeighborhoods('brasil', 'se', 'aracaju');
      try {
        await sut.callEndpoint(mockSearch);
      } catch (err) {
        expect(err.message).to.be.equal('Method not implemented.');
      }
    });

    it('should call buildElementFromDocument and throws a error', async () => {
      const mockSearch = new SearchNeighborhoods('brasil', 'se', 'aracaju');
      try {
        await sut.buildElementFromDocument(mockSearch, null);
      } catch (err) {
        expect(err.message).to.be.equal('Method not implemented.');
      }
    });

    it('should call buildElementFromDocument and throws a error Method not implemented.', async () => {
      const mockSearch = new SearchNeighborhoods('brasil', 'se', 'aracaju');
      const callback = function () {
        return sut.buildElementFromDocument(mockSearch, null);
      };
      expect(callback).to.throws(Error);
    });
  });

  describe('getNeighborhoodsByCity', () => {
    it('should call getNeighborhoodsByCity and call callEndpoint with the correct params', async () => {
      const callEndpointStub = sinon.stub(sut, 'callEndpoint').returns(null);
      const buildElementFromDocumentStub = sinon
        .stub(sut, 'buildElementFromDocument')
        .returns([]);

      const mockSearch = new SearchNeighborhoods('brasil', 'se', 'aracaju');

      await sut.getNeighborhoodsByCity(mockSearch);

      sinon.assert.calledOnceWithExactly(callEndpointStub, mockSearch);

      callEndpointStub.restore();
      buildElementFromDocumentStub.restore();
    });
  });
});
