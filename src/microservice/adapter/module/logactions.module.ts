import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LogAction,
  LogActionSchema
} from '../../domain/schemas/logaction.schema';
import { LogActionsMongoose } from '../repository/logactions/logactions-mongoose.repository';
import { LogActionService } from '../../domain/service/logactions/log-action.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LogAction.name, schema: LogActionSchema }
    ])
  ],
  controllers: [],
  providers: [LogActionsMongoose, LogActionService],
  exports: [LogActionService]
})
export class LogActionsModule {}
