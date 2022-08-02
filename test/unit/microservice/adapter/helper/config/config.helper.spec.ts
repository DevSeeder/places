import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { ConfigHelper } from '../../../../../../src/microservice/adapter/helper/config/config.helper';

describe('ConfigHelper', () => {
  describe('getConfig', () => {
    it('should call getConfig and return places', async () => {
      const actual = ConfigHelper.getConfig('name', 'doc');
      expect(actual).to.be.equal('places');
    });

    it('should call getConfig and return a object', async () => {
      const actual = ConfigHelper.getConfig('neighborhoods', 'repository');
      expect(actual).to.be.equal(null);
    });
  });
});
