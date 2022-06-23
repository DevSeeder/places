import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { CustomPuppeteerModule } from '../../../../../../src/microservice/adapter/helper/modules/custom-puppeteer.module';

describe('CustomPuppeteerModule ', () => {
  it('Should call CustomPuppeteerModule.forRootLaunchOptions with null and set isGlobal false', function () {
    const actual = CustomPuppeteerModule.forRootLaunchOptions(null);
    expect(actual.global).to.be.equal(false);
  });

  it('Should call CustomPuppeteerModule.forRootLaunchOptions with obj and set isGlobal true', function () {
    const actual = CustomPuppeteerModule.forRootLaunchOptions({
      isGlobal: true
    });
    expect(actual.global).to.be.equal(true);
  });
});
