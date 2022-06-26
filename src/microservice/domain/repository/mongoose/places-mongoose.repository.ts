import { Model } from 'mongoose';
import { Place } from '../../interface/place.interface';
import { MongooseRepository } from './mongoose.repository';

export abstract class PlacesMongooseRepository<
  Collection extends Place,
  MongooseModel
> extends MongooseRepository<Collection, MongooseModel> {
  constructor(protected model: Model<MongooseModel>) {
    super(model);
  }

  async findByNameOrAlias(name: string, extraSearch = {}): Promise<any[]> {
    const nameRegex = new RegExp(name, 'i');
    return this.model
      .find({
        ...extraSearch,
        $or: [{ name: nameRegex }, { alias: { $in: [nameRegex] } }]
      })
      .lean()
      .exec();
  }

  async findBySearchParams(
    searchParams: object,
    select: object = {}
  ): Promise<any[]> {
    if (Object.keys(select).length == 0) select = { _id: 0 };
    return this.model
      .find(this.buildRegexFilterQuery(searchParams))
      .select(select)
      .lean()
      .exec();
  }
}
