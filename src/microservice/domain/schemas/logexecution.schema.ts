import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnumTypeLogExecution } from '../enumerators/enum-type-logexecution';
import { Reference } from '../model/references/reference.model';

export type LogExecutionDocument = LogExecution & Document;

@Schema({ collection: 'logExecutions', timestamps: true })
export class LogExecution {
  @Prop({ required: true, type: String })
  type: EnumTypeLogExecution;

  @Prop({ required: false, type: String })
  ip: string;

  @Prop({ required: true, type: Date })
  datetime: Date;

  @Prop({ required: false, type: Date })
  processedDate: Date;

  @Prop({ required: true, type: Object })
  reference: Reference;
}

export const LogExecutionSchema = SchemaFactory.createForClass(LogExecution);
