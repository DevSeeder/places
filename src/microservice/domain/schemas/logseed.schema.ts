import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnumTypeLogSeed } from '../enumerators/enum-type-logseed';

export abstract class ReferenceLogSeed {}

export class ReferenceNeighborhoodsByState extends ReferenceLogSeed {
  constructor(
    public readonly countryId: number,
    public readonly stateId: number,
    public readonly cityId: number
  ) {
    super();
  }
}

export type LogSeedDocument = LogSeed & Document;

@Schema({ collection: 'logSeed' })
export class LogSeed {
  @Prop({ required: true, type: String })
  type: EnumTypeLogSeed;

  @Prop({ required: false })
  ip: string;

  @Prop({ required: true })
  datetime: Date;

  @Prop({ required: true })
  success: boolean;

  @Prop({ required: true })
  processed: boolean;

  @Prop({ required: true, type: Object })
  reference: ReferenceLogSeed;

  @Prop({ required: true, type: Object })
  error: Error;
}

export const LogSeedSchema = SchemaFactory.createForClass(LogSeed);
