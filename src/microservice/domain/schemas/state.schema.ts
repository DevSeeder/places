import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StateDocument = State & Document;

@Schema()
export class State {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  iso2: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  subregion: string;

  @Prop({ required: false })
  alias: string[];

  @Prop({ required: false })
  stateCode: string;

  @Prop({ required: false })
  countryCode: string;

  @Prop({ required: false })
  countryName: string;

  @Prop({ required: false })
  countryId: string;
}

const schema = SchemaFactory.createForClass(State);
schema.index({ name: 1, countryId: 1 }, { unique: true });

export const StateSchema = schema;
