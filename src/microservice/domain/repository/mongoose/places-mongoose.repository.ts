import { Logger } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Model } from 'mongoose';
import { MongoDBException } from '../../../../core/error-handling/exception/mongodb-.exception';
import { Place } from '../../interface/place.interface';
import { MongooseRepository } from './mongoose.repository';

export abstract class PlacesMongooseRepository<
  Collection extends Place,
  MongooseModel
> extends MongooseRepository<Collection, MongooseModel> {
  protected readonly logger: Logger = new Logger(this.constructor.name);

  constructor(protected model: Model<MongooseModel>) {
    super(model);
  }

  async insertOne(item: Collection, name: string): Promise<void> {
    return this.create(item).then(
      () => {
        this.logger.log(
          `${item.constructor.name} '${name}' saved successfully!`
        );
      },
      (err: MongoError) => {
        this.logger.error(err.message);
        throw new MongoDBException(err.message, err.code);
      }
    );
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
}
