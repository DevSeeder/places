import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CountryDocument = Country & Document;

@Schema({ collection: 'countries' })
export class Country {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  iso3: string;

  @Prop({ required: true })
  iso2: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  subregion: string;

  @Prop({ required: false, type: Object })
  // eslint-disable-next-line @typescript-eslint/ban-types
  translations: Object;

  @Prop({ required: false })
  alias: string[];
}

export const CountrySchema = SchemaFactory.createForClass(Country);
