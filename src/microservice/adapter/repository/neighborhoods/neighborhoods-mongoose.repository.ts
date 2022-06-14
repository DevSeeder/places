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
    return await this.neighborhoodsModel.find({}).exec();
  }
}
