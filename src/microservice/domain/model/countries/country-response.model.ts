import { ApiProperty } from '@nestjs/swagger';

export class CountryResponse {
  @ApiProperty({
    type: Number,
    description: 'Country Id reference in database',
    example: 1
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Country Name',
    example: 'Brasil'
  })
  name: string;

  @ApiProperty({
    type: String,
    description: `The code(ISO3) of the Country`,
    example: 'BRA'
  })
  iso3: string;

  @ApiProperty({
    type: String,
    description: `The code(ISO2) of the Country`,
    example: 'BR'
  })
  iso2: string;

  @ApiProperty({
    type: String,
    description: 'Capital',
    example: 'Brasília'
  })
  capital: string;

  @ApiProperty({
    type: String,
    description: 'Currency Symbol',
    example: 'R$'
  })
  currency: string;

  @ApiProperty({
    type: String,
    description: 'Continent Region of the country',
    example: 'South America'
  })
  region: string;

  @ApiProperty({
    type: String,
    description: 'Continent SubRegion of the country',
    example: 'South'
  })
  subregion: string;

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'Alias names',
    example: ['BR', 'BRA', 'Brazil', 'Brasil']
  })
  alias: string;

  @ApiProperty({
    type: Number,
    description: 'Phone number code DDI',
    example: 55
  })
  phoneCode: number;
}
