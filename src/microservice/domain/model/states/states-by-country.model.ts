import { ApiProperty } from '@nestjs/swagger';
import { PlacesReponse } from '../places-response.model';

export class StatesByCountry extends PlacesReponse {
  @ApiProperty({
    type: String,
    description: 'The name of the State',
    example: 'Santa Catarina'
  })
  name: string;
}
