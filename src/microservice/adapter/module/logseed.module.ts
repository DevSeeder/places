import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogSeed, LogSeedSchema } from '../../domain/schemas/logseed.schema';
import { LogSeedMongoose } from '../repository/logseed/logseed-mongoose.repository';
import { LogSeedJobService } from '../../domain/service/logseed/log-seed-job.service';
import { GetLogSeedByIdService } from '../../domain/service/logseed/get-log-seed-by-id.service';
import { GetLogSeedByCityService } from '../../domain/service/logseed/get-log-seed-by-city.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LogSeed.name, schema: LogSeedSchema }])
  ],
  controllers: [],
  providers: [
    LogSeedMongoose,
    LogSeedJobService,
    GetLogSeedByIdService,
    GetLogSeedByCityService
  ],
  exports: [LogSeedJobService, GetLogSeedByIdService, GetLogSeedByCityService]
})
export class LogSeedModule {}
