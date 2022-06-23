import { PuppeteerModule } from 'nest-puppeteer';
import { PuppeteerCoreModule } from 'nest-puppeteer/dist/puppeteer-core.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const puppeteer_core_module_1 = require('nest-puppeteer/dist/puppeteer-core.module');
export class CustomPuppeteerModule extends PuppeteerModule {
  static forRootLaunchOptions(options) {
    return {
      module: PuppeteerModule,
      global: options === null ? false : options.isGlobal,
      imports: [PuppeteerCoreModule.forRoot(options)]
    };
  }
}
