import '../../../../../../src/microservice/adapter/helper/extensions/exensions.module';
import { expect } from 'chai';
import { SearchNeighborhoodsInput } from '../../../../../../src/microservice/domain/model/search/neighborhoods/search-neighborhoods-input.model';

describe('object.extension', () => {
  describe('getMethods', function () {
    it('Should call getMethods and contain toString', function () {
      const obj = new Object();
      expect(obj.getMethods()).to.include.members(['toString']);
    });
  });

  describe('validateIsAnyEmptyKey', function () {
    it('Should call validateIsAnyEmptyKey and throw exccption', function () {
      const validation = () => {
        const obj = new SearchNeighborhoodsInput('brasil', 'sc', 'orleans');
        obj.city = '';
        obj.validateIsAnyEmptyKey();
      };

      try {
        validation();
      } catch (err) {
        expect(err.message).to.be.equal("The property 'City' cannot be empty");
      }
    });
  });
});
