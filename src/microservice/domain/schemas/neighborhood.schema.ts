import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NeighborhoodDocument = Neighborhood & Document;

@Schema()
export class Neighborhood {
  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  states: States[];
}

class States {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cities: Cities[];
}

class Cities {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cities: Neighborhoods[];
}

class Neighborhoods {
  @Prop({ required: true })
  name: string;
}

export const NeighborhoodSchema = SchemaFactory.createForClass(Neighborhood);
