import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Place } from '../interface/place.interface';
import { Translations } from '../model/translations.model';

export type CountryDocument = Country & Document;

@Schema({ collection: 'countries', timestamps: true })
export class Country implements Place {
  @Prop({ required: true })
  id: number;

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
  translations: Translations;

  @Prop({ required: false })
  alias: string[];

  @Prop({ required: false })
  numericCode: string;

  @Prop({ required: false })
  phoneCode: string;

  @Prop({ required: false })
  currencyName: string;

  @Prop({ required: false })
  currencySymbol: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
