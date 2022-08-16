import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { MongooseHelper } from '../../../../../../src/microservice/adapter/helper/mongoose/mongoose.helper';

describe('MongooseHelper', () => {
  describe('buildRegexFilterQuery', () => {
    it('should call buildRegexFilterQuery and return regex filter', async () => {
      const mockParams = {
        countryId: 1,
        stateId: 2,
        cityId: 3,
        name: 'any'
      };

      const mockRegex = {
        countryId: 1,
        stateId: 2,
        cityId: 3,
        name: new RegExp('any', 'i')
      };

      const actual = await MongooseHelper.buildRegexFilterQuery(mockParams);

      expect(JSON.stringify(actual)).to.be.equal(JSON.stringify(mockRegex));
    });

    it('should call buildRegexFilterQuery and return regex filter with empty obj', async () => {
      const actual = await MongooseHelper.buildRegexFilterQuery();
      expect(JSON.stringify(actual)).to.be.equal(JSON.stringify({}));
    });

    it('should call buildRegexFilterQuery with null param and return regex filter with empty obj', async () => {
      const actual = await MongooseHelper.buildRegexFilterQuery({
        name: null
      });
      expect(JSON.stringify(actual)).to.be.equal(JSON.stringify({}));
    });
  });

  describe('buildSelectAggregated', () => {
    it('should call buildSelectAggregated with default params', async () => {
      const actual = MongooseHelper.buildSelectAggregated();
      expect(JSON.stringify(actual)).to.be.equal('{}');
    });
  });
});
