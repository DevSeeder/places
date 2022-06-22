import { Logger } from '@nestjs/common';
import { ClientSession, Model } from 'mongoose';

export abstract class MongooseRepository<Collection, MongooseModel> {
  protected readonly logger: Logger = new Logger(this.constructor.name);
  private session: ClientSession;

  constructor(protected model: Model<MongooseModel>) {}

  async create(document: Collection): Promise<void> {
    return new Promise(async (resolve, reject) => {
      await this.model.create(document, function (err) {
        if (err) reject(err);
        resolve();
      });
    });
  }

  // private async startSession(): Promise<ClientSession> {
  //   this.session = await this.connection.startSession();
  //   return this.session;
  // }

  // async startTransaction(): Promise<void> {
  //   if (!this.session || !this.session.inTransaction())
  //     await this.startSession();

  //   await this.session.startTransaction();
  //   this.logger.log('Starting transaction...');
  // }

  // async commit(): Promise<void> {
  //   if (this.session.inTransaction()) {
  //     this.logger.log('Commit transaction...');
  //     await this.session.commitTransaction();
  //   }
  // }

  // async rollback(): Promise<void> {
  //   if (this.session.inTransaction()) {
  //     this.logger.error('Rollback transaction...');
  //     await this.session.abortTransaction();
  //   }
  // }

  // buildRegexFilterQuery(objSearch: object = {}) {
  //   const objRegex = {};
  //   Object.keys(objSearch).forEach(function (key) {
  //     objRegex[key] = new RegExp(objRegex[key], 'i');
  //   });
  //   return objRegex;
  // }
}
