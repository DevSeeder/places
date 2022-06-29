import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedNeighborhoodsByStateService } from '../domain/service/neighborhoods/seed/seed-neighborhoods-by-state.service';
import { LogSeed, LogSeedSchema } from '../domain/schemas/logseed.schema';
import { LogSeedMongoose } from './repository/logseed/logseed-mongoose.repository';
import { LogSeedJobService } from '../domain/service/logseed/log-seed-job.service';
import { SeedController } from './controller/seed.controller';
import { NeighborhoodsModule } from './neighborhoods.module';
import { CitiesModule } from './cities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    MongooseModule.forFeature([{ name: LogSeed.name, schema: LogSeedSchema }]),
    CitiesModule,
    NeighborhoodsModule
  ],
  controllers: [SeedController],
  providers: [
    LogSeedMongoose,
    SeedNeighborhoodsByStateService,
    LogSeedJobService
  ]
})
export class SeedModule {}
