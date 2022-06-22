import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Place } from '../interface/place.interface';

export type NeighborhoodDocument = Neighborhood & Document;

@Schema()
export class Neighborhood implements Place {
  id: number;

  alias: string[];

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  countryId: number;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  stateId: number;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  cityId: number;

  @Prop({ required: true })
  name: string;
}

const schema = SchemaFactory.createForClass(Neighborhood);
schema.index({ name: 1, country: 1, state: 1, city: 1 }, { unique: true });

export const NeighborhoodSchema = schema;
