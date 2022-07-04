import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnumTypeLogSeed } from '../enumerators/enum-type-logseed';
import { ReferenceLogSeed } from '../model/logseed/reference/reference-neighborhoods-by-state.model';

export type LogSeedDocument = LogSeed & Document;

@Schema({ collection: 'logSeed', timestamps: true })
export class LogSeed {
  @Prop({ required: true, type: String })
  type: EnumTypeLogSeed;

  @Prop({ required: false, type: String })
  ip: string;

  @Prop({ required: true, type: Date })
  datetime: Date;

  @Prop({ required: true, type: Boolean })
  success: boolean;

  @Prop({ required: true, type: Boolean })
  processed: boolean;

  @Prop({ required: false, type: Date })
  processedDate: Date;

  @Prop({ required: true, type: Object })
  reference: ReferenceLogSeed;

  @Prop({ required: true, type: Object })
  error: Error;

  @Prop({ required: false, type: String })
  resolution: string;
}

export const LogSeedSchema = SchemaFactory.createForClass(LogSeed);
