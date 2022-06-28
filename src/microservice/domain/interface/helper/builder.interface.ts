export interface IBuilder<BuiltElement> {
  build(buildParams): BuiltElement;
}
