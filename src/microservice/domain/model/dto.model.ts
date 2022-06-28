import { EmptyPropException } from '../../../core/error-handling/exception/empty-prop.exception';

export abstract class DTO {
  validateIsAnyEmptyKey() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    Object.keys(this).forEach(function (key) {
      if (context[key].length === 0) throw new EmptyPropException(key);
    });
  }
}
