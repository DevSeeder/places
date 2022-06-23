export class SearchNeighborhoodsInput {
  public name: string;

  constructor(
    public country: string,
    public state: string,
    public city: string
  ) {}

  setName(name: string) {
    this.name = name;
  }
}
