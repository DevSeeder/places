export class NeighborhoodsByState {
  [key: string]: NeighborhooodAggregatedByCity[];
}

export class NeighborhooodAggregatedByCity {
  name: string;
  cityId: number;
  state: string;
}
