import { SeedException } from './seed.exception';

export class MissingSeedException extends SeedException {
  constructor(
    actual: number,
    expected: number,
    refElement: string,
    refPluralElement = ''
  ) {
    refPluralElement =
      refPluralElement.length > 0 ? refPluralElement : `${refElement}s`;
    super(
      actual === 0
        ? `No ${refElement} has been seeded`
        : `The are (${expected - actual}) seeded ${refPluralElement} missing`
    );
  }
}
