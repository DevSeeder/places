import { ApiProperty } from '@nestjs/swagger';
import { DTO } from '../../dto.model';

export class SearchRegionsDTO extends DTO {
  @ApiProperty({
    type: String,
    description: 'The country of the Region'
  })
  public country: string;

  constructor(country: string) {
    super();
    this.country = country;
  }
}
