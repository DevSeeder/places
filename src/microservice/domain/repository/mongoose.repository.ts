import { Logger } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Collection, Model } from 'mongoose';
import { MongoDBException } from '../../../core/error-handling/exception/mongodb-.exception';

export abstract class MongooseRepository<Collection, MongooseModel> {
  protected readonly logger: Logger = new Logger(this.constructor.name);
  private elementName = Collection.name;

  constructor(protected model: Model<MongooseModel>) {}

  async insertOne(item: Collection, name: string): Promise<void> {
    return this.create(item).then(
      () => {
        this.logger.log(`${this.elementName} '${name}' saved successfully!`);
      },
      (err: MongoError) => {
        this.logger.error(err.message);
        throw new MongoDBException(err.message, err.code);
      }
    );
  }

  async create(document: Collection): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.model.create(document, function (err) {
        if (err) reject(err);
        resolve();
      });
    });
  }
}
