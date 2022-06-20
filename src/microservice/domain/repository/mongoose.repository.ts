import { Model } from 'mongoose';
import { NeighborhoodDocument } from '../schemas/neighborhood.schema';

export abstract class MongooseRepository<Collection> {
  constructor(protected model: Model<NeighborhoodDocument>) {}

  async insert(document: Collection): Promise<void> {
    this.model.create(document);
  }
}
