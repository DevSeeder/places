import { ApiProperty } from '@nestjs/swagger';

export abstract class PlacesReponse {
  @ApiProperty({
    type: Number,
    description: `Id reference in database`,
    example: 1
  })
  id: number;

  @ApiProperty({
    type: String,
    description: `The code(ISO3) of the Country's State`,
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
    description: `The code(ISO2) of the State`,
    example: 'SC'
  })
  stateCode: string;
}
