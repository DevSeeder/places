import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { State, StateDocument } from '../../../domain/schemas/state.schema';
import { PlacesMongooseRepository } from '../../../domain/repository/mongoose/places-mongoose.repository';

@Injectable()
export class StatesMongoose extends PlacesMongooseRepository<
  State,
  StateDocument
> {
  constructor(
    @InjectModel(State.name)
    model: Model<StateDocument>,
    @InjectConnection() protected readonly connection: Connection
  ) {
    super(model, connection);
  }
}
