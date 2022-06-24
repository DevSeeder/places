export class NeighborhoodsByState {
  [key: string]: NeighborhooodAgregatedByCity[];
}

export class NeighborhooodAgregatedByCity {
  name: string;
  cityId: number;
  state: string;
}
