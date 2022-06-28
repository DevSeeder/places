import { IBuilder } from '../../interface/helper/builder.interface';

export abstract class Builder<InputElementConvert, BuiltElement>
  implements IBuilder<BuiltElement>
{
  constructor(protected readonly inputElement: InputElementConvert) {}

  abstract build(buildParams?: any): BuiltElement;
}
