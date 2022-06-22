import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NeighborhoodDocument = Neighborhood & Document;

@Schema()
export class Neighborhood {
  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  name: string;
}

const schema = SchemaFactory.createForClass(Neighborhood);
schema.index({ name: 1, country: 1, state: 1, city: 1 }, { unique: true });

export const NeighborhoodSchema = schema;
