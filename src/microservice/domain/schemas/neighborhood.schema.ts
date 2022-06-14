import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NeighborhoodDocument = Neighborhood & Document;

@Schema()
export class Neighborhood {
  @Prop({ required: true })
  name: string;
}

export const NeighborhoodSchema = SchemaFactory.createForClass(Neighborhood);
