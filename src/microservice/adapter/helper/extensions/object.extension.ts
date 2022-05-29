/* eslint-disable @typescript-eslint/no-this-alias */
import { EmptyPropException } from '../../../../core/error-handling/exception/empty-prop.exception';

declare global {
  interface Object {
    validateIsAnyEmptyKey(): void;
    getMethods(): string[];
    isEmpty(): boolean;
  }
}

Object.prototype.validateIsAnyEmptyKey = function () {
  const context = this;
  Object.keys(this).forEach(function (key) {
    if (context[key].length == 0) throw new EmptyPropException(key);
  });
};

Object.prototype.getMethods = (): any[] => {
  const properties = new Set();
  let currentObj = this;
  const obj = this;
  do {
    Object.getOwnPropertyNames(currentObj).map((item) => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(
    (item: string) =>
      typeof obj !== 'undefined' && typeof obj[item] === 'function'
  );
};

Object.prototype.isEmpty = (): boolean => {
  return Object.keys(this).length == 0;
};

export {};
