/** @jest-environment jsdom */
import { Test, TestingModule } from '@nestjs/testing';
import { PuppeteerModule } from 'nest-puppeteer';
import { EvaluateFn } from 'puppeteer';
import {
  OptionsPage,
  Page
} from '../../../../../src/domain/interfaces/puppeteer/page.interface';
import { ExtensionsModule } from '../../../../../src/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { PuppeteerRepository } from '../../../../../src/domain/repository/puppeteer/puppeteer.repository';

jest.useFakeTimers();
jest.setTimeout(50000);

const mockAnonFunc = () => '<html><head></head><body></body></html>';

class MockPage implements Page {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  goto(url: string, options: OptionsPage): Promise<void> {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  evaluate(pageFunction: EvaluateFn<any>) {
    return (pageFunction.toString = mockAnonFunc);
  }
}

class mockExtendClass extends PuppeteerRepository {
  constructor() {
    super('any_url', new MockPage());
  }
}

describe('PuppeteerRepository', () => {
  let sut: PuppeteerRepository;
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

  describe('getDataHtml', () => {
    it('should call getDataHtml  and not throws error', async () => {
      expect(async () => {
        return await sut.getDataHtml();
      }).to.not.throw();
    });

    it('should call getDataHtml and return the HTML', async () => {
      const data = await sut.getDataHtml();
      expect(data).to.be.equal(mockAnonFunc);
      expect(document.querySelector('*').outerHTML).to.be.equal(
        '<html><head></head><body></body></html>'
      );
    });
  });

  describe('goToUrl', () => {
    it('should call goToUrl and not throws error', async () => {
      expect(async () => {
        return await sut.goToUrl('any_url');
      }).to.not.throw();
    });
  });
});
