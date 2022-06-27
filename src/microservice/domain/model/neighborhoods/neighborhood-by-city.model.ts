import { ApiProperty } from '@nestjs/swagger';

export class NeighborhoodByCity {
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
    description: `The name of the City's Neighborhood`,
    example: 'Orleans'
  })
  city: string;

  @ApiProperty({
    type: Number,
    description: 'The id reference of the state in database',
    example: 2014
  })
  stateId: number;

  @ApiProperty({
    type: Number,
    description: 'The id reference of the country in database',
    example: 31
  })
  countryId: number;
}
