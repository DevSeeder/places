import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { SearchNeighborhoods } from 'src/microservice/domain/model/search/search-neighborhoods.model';
import { MongooseRepository } from '../../../domain/repository/mongoose.repository';
import {
  Neighborhood,
  NeighborhoodDocument
} from '../../../domain/schemas/neighborhood.schema';

@Injectable()
export class NeighborhoodsMongoose extends MongooseRepository<
  Neighborhood,
  NeighborhoodDocument
> {
  constructor(
    @InjectModel(Neighborhood.name)
    model: Model<NeighborhoodDocument>,
    @InjectConnection() protected readonly connection: Connection
  ) {
    super(model, connection);
  }

  async findBySearchParams(
    searchParams: SearchNeighborhoods
  ): Promise<Neighborhood[]> {
    return this.model.find(searchParams).select({ _id: 0 }).lean().exec();
  }
}
