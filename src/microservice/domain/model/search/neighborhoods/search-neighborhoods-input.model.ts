export class SearchNeighborhoodsInput {
  public name: string;

  constructor(
    public country: string,
    public state: string,
    public city: string = null
  ) {}

  setName(name: string) {
    this.name = name;
  }
}
