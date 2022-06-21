import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '../../../domain/repository/mongoose.repository';
import {
  Country,
  CountryDocument
} from '../../../domain/schemas/country.schema';

@Injectable()
export class CountriesMongoose extends MongooseRepository<
  Country,
  CountryDocument
> {
  constructor(
    @InjectModel(Country.name)
    model: Model<CountryDocument>
  ) {
    super(model);
  }

  async findByNameOrAlias(name: string): Promise<Country[]> {
    const nameRegex = new RegExp(name, 'i');
    return this.model
      .find({
        $or: [{ name: nameRegex }, { alias: { $in: [nameRegex] } }]
      })
      .lean()
      .exec();
  }
}
