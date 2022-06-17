import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NeighborhoodDocument = Neighborhood & Document;

@Schema()
export class Neighborhood {
  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  states: StatesNeighborhood[];
}

export class StatesNeighborhood {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cities: CitiesNeighborhood[];
}

export class CitiesNeighborhood {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  neighborhoods: Neighborhoods[];
}

export class Neighborhoods {
  @Prop({ required: true })
  name: string;
  _id: string;
}

export const NeighborhoodSchema = SchemaFactory.createForClass(Neighborhood);
