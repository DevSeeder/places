declare global {
  interface String {
    capitalize(): string;
  }
}

String.prototype.capitalize = function () {
  return this.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
};

export {};
