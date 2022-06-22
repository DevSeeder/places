import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City, CityDocument } from '../../../domain/schemas/city.schema';
import { PlacesMongooseRepository } from '../../../domain/repository/mongoose/places-mongoose.repository';

@Injectable()
export class CitiesMongoose extends PlacesMongooseRepository<
  City,
  CityDocument
> {
  constructor(
    @InjectModel(City.name)
    model: Model<CityDocument>
  ) {
    super(model);
  }
}
