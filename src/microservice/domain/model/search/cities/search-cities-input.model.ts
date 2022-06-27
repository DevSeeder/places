import { ApiProperty } from '@nestjs/swagger';

export class SearchCitiesInput {
  @ApiProperty({
    type: String,
    description: 'The country of the City'
  })
  public country: string;

  @ApiProperty({
    type: String,
    description: 'The state of the City'
  })
  public state: string;

  constructor(country: string, state: string) {
    this.country = country;
    this.state = state;
  }
}
