import { expect } from 'chai';
import { EnumTranslations } from '../../../../../src/microservice/domain/enumerators/enum-translations.enumerator';
import { Translations } from '../../../../../src/microservice/domain/model/translations.model';

describe('Translations', () => {
  it('should instance Translations and return the object with the correct properties', async () => {
    const model = new Translations();
    model[EnumTranslations.BR] = 'Brasil';
    expect(model[EnumTranslations.BR]).to.be.equal('Brasil');
  });
});
