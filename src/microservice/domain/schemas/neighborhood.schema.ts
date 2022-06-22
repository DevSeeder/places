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

  @Prop({ required: true, unique: true })
  name: string;
}

export const NeighborhoodSchema = SchemaFactory.createForClass(Neighborhood);
