export class SearchNeighborhoodsDB {
  public name;

  constructor(
    public countryId: number,
    public stateId: number,
    public cityId: number = null
  ) {}
}
