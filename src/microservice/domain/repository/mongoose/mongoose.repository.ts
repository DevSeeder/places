import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';

export abstract class MongooseRepository<Collection, MongooseModel> {
  protected readonly logger: Logger = new Logger(this.constructor.name);

  constructor(protected model: Model<MongooseModel>) {}

  async create(document: Collection): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.model.create(document, function (err) {
        if (err) reject(err);
        resolve();
      });
    });
  }

  buildRegexFilterQuery(objSearch: object = {}) {
    const objSearchRegex = {};
    Object.keys(objSearch).forEach(function (key) {
      objSearchRegex[key] = objSearch[key];
      if (isNaN(objSearch[key]))
        objSearchRegex[key] = new RegExp(objSearch[key], 'i');
    });
    return objSearchRegex;
  }
}
