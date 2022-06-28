import { ApiProperty } from '@nestjs/swagger';
import { DTO } from '../../dto.model';

export class SearchCitiesDTO extends DTO {
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
    super();
    this.country = country;
    this.state = state;
  }
}
