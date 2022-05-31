/* eslint-disable @typescript-eslint/no-this-alias */
import { EmptyPropException } from '../../../../core/error-handling/exception/empty-prop.exception';

declare global {
  interface Object {
    validateIsAnyEmptyKey(): void;
    getMethods(): string[];
  }
}

Object.prototype.validateIsAnyEmptyKey = function () {
  const context = this;
  Object.keys(this).forEach(function (key) {
    if (context[key].length === 0) throw new EmptyPropException(key);
  });
};

Object.prototype.getMethods = (): any[] => {
  const properties = new Set();
  let currentObj = this;
  const obj = this;
  do {
    Object.getOwnPropertyNames(currentObj).forEach((item) =>
      properties.add(item)
    );
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(
    (item: string) =>
      typeof obj !== 'undefined' && typeof obj[item] === 'function'
  );
};

export {};
