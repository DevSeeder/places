import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Place } from '../interface/place.interface';

export type CityDocument = City & Document;

@Schema({ collection: 'cities' })
export class City implements Place {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  alias: string[];

  @Prop({ required: false })
  countryCode: string;

  @Prop({ required: false })
  countryName: string;

  @Prop({ required: false })
  countryId: number;

  @Prop({ required: false })
  stateCode: string;

  @Prop({ required: false })
  stateName: string;

  @Prop({ required: false })
  stateId: number;
}

const schema = SchemaFactory.createForClass(City);
schema.index({ name: 1, countryId: 1 }, { unique: true });

export const CitySchema = schema;
