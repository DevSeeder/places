import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { State, StateDocument } from '../../../domain/schemas/state.schema';
import { PlacesMongooseRepository } from '../../../domain/repository/mongoose/places-mongoose.repository';

@Injectable()
export class StatesMongoose extends PlacesMongooseRepository<
  State,
  StateDocument
> {
  constructor(
    @InjectModel(State.name)
    model: Model<StateDocument>
  ) {
    super(model);
  }
}
