import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '../../../domain/repository/mongoose.repository';
import {
  Neighborhood,
  NeighborhoodDocument
} from '../../../domain/schemas/neighborhood.schema';

@Injectable()
export class NeighborhoodsMongoose extends MongooseRepository<Neighborhood> {
  constructor(
    @InjectModel(Neighborhood.name)
    protected model: Model<NeighborhoodDocument>
  ) {
    super(model);
  }

  async findAll(): Promise<Neighborhood[]> {
    return await this.model.find().select({ _id: 0 }).lean().exec();
  }

  async findByCountryStateAndCity(
    country: string,
    state: string,
    city: string
  ): Promise<Neighborhood[]> {
    console.log({
      country,
      'states.name': state,
      'states.cities.name': city
    });
    return await this.model
      .find({
        country,
        'states.name': state,
        'states.cities.name': city
      })
      .select({ _id: 0 })
      .lean()
      .exec();
  }
}
