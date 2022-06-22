import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { City, CityDocument } from '../../../domain/schemas/city.schema';
import { PlacesMongooseRepository } from '../../../domain/repository/mongoose/places-mongoose.repository';

@Injectable()
export class CitiesMongoose extends PlacesMongooseRepository<
  City,
  CityDocument
> {
  constructor(
    @InjectModel(City.name)
    model: Model<CityDocument>,
    @InjectConnection() protected readonly connection: Connection
  ) {
    super(model, connection);
  }
}
