import { ApiProperty } from '@nestjs/swagger';

export class CityResponse {
  @ApiProperty({
    type: Number,
    description: 'City Id reference in database',
    example: 1
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'The name of the City',
    example: 'Orleans'
  })
  name: string;

  @ApiProperty({
    type: String,
    description: `The code(ISO3) of the Country's City`,
    example: 'BRA'
  })
  countryCode: string;

  @ApiProperty({
    type: Number,
    description: 'Country Id reference in database',
    example: 31
  })
  countryId: number;

  @ApiProperty({
    type: String,
    description: `The code(ISO2) of the State's City`,
    example: 'SC'
  })
  stateCode: string;

  @ApiProperty({
    type: Number,
    description: 'State Id reference in database',
    example: 2014
  })
  stateId: number;
}
