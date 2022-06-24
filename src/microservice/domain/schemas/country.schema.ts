import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnumTranslations } from '../enumerators/enum-translations.enumerator';
import { Place } from '../interface/place.interface';

export class Translations {
  public kr: string = EnumTranslations.KR;
  public br: string = EnumTranslations.BR;
  public pt: string = EnumTranslations.PT;
  public nl: string = EnumTranslations.NL;
  public hr: string = EnumTranslations.HR;
  public fa: string = EnumTranslations.FA;
  public de: string = EnumTranslations.DE;
  public es: string = EnumTranslations.ES;
  public fr: string = EnumTranslations.FR;
  public ja: string = EnumTranslations.JS;
  public it: string = EnumTranslations.IT;
  public cn: string = EnumTranslations.CN;
  public tr: string = EnumTranslations.TR;
}

export type CountryDocument = Country & Document;

@Schema({ collection: 'countries' })
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
