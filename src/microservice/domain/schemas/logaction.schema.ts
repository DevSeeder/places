import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EnumTypeAction } from '../enumerators/enum-type-action';
import { Reference } from '../model/references/reference.model';
import { MongooseDocumentID } from '../repository/mongoose/mongoose.repository';

export type LogActionDocument = LogAction & Document;

@Schema({ collection: 'logActions', timestamps: true })
export class LogAction {
  @Prop({ required: true, type: String })
  type: EnumTypeAction;

  @Prop({ required: false, type: String })
  idLogExecution: MongooseDocumentID;

  @Prop({ required: true, type: Date })
  datetime: Date;

  @Prop({ required: true, type: Object })
  reference: Reference;
}

export const LogActionSchema = SchemaFactory.createForClass(LogAction);
