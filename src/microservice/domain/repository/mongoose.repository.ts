import { Model } from 'mongoose';

export abstract class MongooseRepository<Collection, MongooseModel> {
  constructor(protected model: Model<MongooseModel>) {}

  async insert(document: Collection): Promise<void> {
    this.model.create(document);
  }
}
