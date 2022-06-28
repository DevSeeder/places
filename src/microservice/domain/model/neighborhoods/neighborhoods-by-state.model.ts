import { ApiProperty } from '@nestjs/swagger';

export class NeighborhoodsByState {
  [key: string]: NeighborhooodAggregatedByCity[];
}

export class NeighborhooodAggregatedByCity {
  @ApiProperty({
    type: String,
    description: 'The name of the Neighborhood',
    example: 'Alto Paraná'
  })
  name: string;

  @ApiProperty({
    type: Number,
    description: 'The id reference of the City in database',
    example: 1
  })
  cityId: number;

  @ApiProperty({
    type: String,
    description: 'The name of the state',
    example: 'Santa Catarina - BRA'
  })
  state: string;
}
