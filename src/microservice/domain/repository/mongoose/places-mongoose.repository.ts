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
    return this.find(searchParams, select, sort);
  }

  async updateById(id: number, data: any): Promise<void> {
    return this.updateOne({ id }, data);
  }
}
