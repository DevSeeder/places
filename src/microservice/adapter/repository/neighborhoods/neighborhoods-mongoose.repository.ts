import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Neighborhood,
  NeighborhoodDocument
} from '../../../domain/schemas/neighborhood.schema';

@Injectable()
export class NeighborhoodsMongoose {
  constructor(
    @InjectModel(Neighborhood.name)
    private neighborhoodsModel: Model<NeighborhoodDocument>
  ) {}

  async findAll(): Promise<Neighborhood[]> {
    return await this.neighborhoodsModel
      .find()
      .select({ _id: 0 })
      .lean()
      .exec();
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
    return await this.neighborhoodsModel
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
