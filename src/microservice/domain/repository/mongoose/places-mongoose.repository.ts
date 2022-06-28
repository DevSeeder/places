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

  async findByNameOrAliasOrId(ref: string, extraSearch = {}): Promise<any[]> {
    const nameRegex = new RegExp(ref, 'i');
    return this.model
      .find({
        ...extraSearch,
        $or: [
          { alias: { $in: [nameRegex] } },
          isNaN(parseInt(ref)) ? { name: nameRegex } : { id: ref }
        ]
      })
      .lean()
      .exec();
  }

  async findBySearchParams(
    searchParams: object,
    select: object = {}
  ): Promise<any[]> {
    console.log(JSON.stringify(searchParams));
    if (Object.keys(select).length == 0) select = { _id: 0 };
    return this.model
      .find(this.buildRegexFilterQuery(searchParams))
      .select(select)
      .lean()
      .exec();
  }
}
