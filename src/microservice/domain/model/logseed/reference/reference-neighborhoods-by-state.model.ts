export abstract class ReferenceLogSeed {}

export class ReferenceNeighborhoodsByState extends ReferenceLogSeed {
  constructor(
    public readonly countryId: number,
    public readonly stateId: number,
    public readonly cityId: number,
    public readonly countryName: string,
    public readonly stateName: string,
    public readonly cityName: string
  ) {
    super();
  }
}
