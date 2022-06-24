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

  async groupBy(group, match = {}, select = {}): Promise<any[]> {
    const agregateParams = [];

    if (Object.keys(match).length > 0) agregateParams.push({ $match: match });

    agregateParams.push({
      $group: {
        _id: group,
        count: { $sum: 1 },
        ...this.buildSelectAgregated(select)
      }
    });
    return this.model.aggregate(agregateParams);
  }

  buildSelectAgregated(groupSelect: object = {}) {
    const objGroup = {};
    if (Object.keys(groupSelect).length > 0) {
      Object.keys(groupSelect).forEach((key) => {
        objGroup[key] = {
          $first: `$${groupSelect[key]}`
        };
      });
    }
    return objGroup;
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
