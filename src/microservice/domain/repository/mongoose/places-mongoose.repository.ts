import { Model } from 'mongoose';
import { MongooseHelper } from 'src/microservice/adapter/helper/mongoose/mongoose.helper';
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
    const nameRegex = new RegExp(`^${ref}$`, 'i');
    const querySearch = {
      ...extraSearch,
      $or: [
        { alias: { $in: [nameRegex] } },
        isNaN(parseInt(ref)) ? { name: nameRegex } : { id: ref }
      ]
    };
    return this.model.find(querySearch).lean().exec();
  }

  async findBySearchParams(
    searchParams: object,
    select: object = {},
    sort: any = { name: 1 }
  ): Promise<any[]> {
    if (Object.keys(select).length === 0) select = { _id: 0 };

    let res = this.model.find(
      MongooseHelper.buildRegexFilterQuery(searchParams)
    );

    if (typeof sort === 'object' && Object.keys(sort).length > 0)
      res = res.sort(sort);

    return res.select(select).lean().exec();
  }
}
