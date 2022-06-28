import { ApiProperty } from '@nestjs/swagger';
import { PlacesReponse } from '../places-response.model';

export class CityResponse extends PlacesReponse {
  @ApiProperty({
    type: String,
    description: 'The name of the City',
    example: 'Orleans'
  })
  name: string;
}
