import { Module } from '@nestjs/common';
import { BairrosController } from './bairros.controller';
import { BairrosService } from './bairros.service';

@Module({
  imports: [],
  controllers: [BairrosController],
  providers: [BairrosService],
})
export class BairrosModule {}
